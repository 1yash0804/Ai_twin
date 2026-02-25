import os
import re
import operator
from dotenv import load_dotenv
from typing import Annotated, Literal, Sequence, TypedDict

from langchain_core.messages import AIMessage, BaseMessage, HumanMessage, SystemMessage
from langchain_groq import ChatGroq
from langgraph.graph import END, StateGraph
from langgraph.prebuilt import ToolNode

from app.core.tools import get_all_tools

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant"


class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    model_type: Literal["general"]
    adapter_name: str | None
    tools_enabled: bool  # NEW: tracks whether tools are available this run


def get_llm(
    model_type: str = "general",
    adapter_name: str | None = None,
    purpose: Literal["conversation", "structured"] = "conversation",
):
    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is required for all LLM operations.")

    if model_type != "general":
        model_type = "general"

    temperature = 0 if purpose == "structured" else 0.2

    return ChatGroq(
        temperature=temperature,
        model_name=DEFAULT_GROQ_MODEL,
        groq_api_key=GROQ_API_KEY,
    )


def _clean_response(text: str) -> str:
    """Strip leaked raw function call XML tags from model output."""
    # Remove <function=...>...</function> blocks
    text = re.sub(r"<function=\w+>.*?</function>", "", text, flags=re.DOTALL)
    # Remove leftover JSON blobs like {"query": "..."} at start of response
    text = re.sub(r"^\s*\{.*?\}\s*", "", text, flags=re.DOTALL)
    return text.strip()


def call_model(state: AgentState):
    messages = state["messages"]
    tools_enabled = state.get("tools_enabled", True)
    llm = get_llm(model_type="general", purpose="conversation")

    if tools_enabled:
        tools = get_all_tools()
        try:
            llm_with_tools = llm.bind_tools(tools)
            response = llm_with_tools.invoke(messages)
            # If response has no tool_calls, clean any leaked syntax
            if not (hasattr(response, "tool_calls") and response.tool_calls):
                response = AIMessage(content=_clean_response(response.content))
            return {"messages": [response], "tools_enabled": True}
        except Exception as exc:
            print(f"⚠️ Tool binding failed: {exc}")
            # Fall through to plain invocation with tools disabled
            response = llm.invoke(messages)
            return {
                "messages": [AIMessage(content=_clean_response(response.content))],
                "tools_enabled": False,  # disable tools for rest of this run
            }
    else:
        # Tools already failed this run — go plain
        response = llm.invoke(messages)
        return {
            "messages": [AIMessage(content=_clean_response(response.content))],
            "tools_enabled": False,
        }


def should_continue(state: AgentState):
    # If tools are disabled this run, always end
    if not state.get("tools_enabled", True):
        return END

    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"

    return END


def generate_answer(
    query: str,
    context: list = [],
    history: list = [],
    model_type: str = "general",
    adapter_name: str | None = None,
    system_context: str | None = None,
):
    if system_context:
        knowledge_block = system_context
    else:
        knowledge_block = "\n\n".join([f"- {item.get('text', '')}" for item in context])

    system_text = f"""
You are the AI Twin of a software engineer named Yash.

[YOUR BRAIN / CONTEXT]
{knowledge_block}

[RULES]
1. Use the [RELEVANT PAST MEMORIES] section when available.
2. Prioritize the current conversation for coding questions.
3. Use tools only when external data is required.
4. Be direct, technical, and concise.
5. Never output raw function call syntax like <function=...> in your replies.
"""

    formatted_history = []
    for msg in history:
        role = msg.get("role")
        content = msg.get("content")
        if role == "user":
            formatted_history.append(HumanMessage(content=content))
        elif role == "assistant":
            formatted_history.append(AIMessage(content=content))

    system_msg = SystemMessage(content=system_text)
    initial_messages = [system_msg] + formatted_history + [HumanMessage(content=query)]

    workflow = StateGraph(AgentState)
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", ToolNode(get_all_tools()))
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges(
        "agent", should_continue, {"tools": "tools", END: END}
    )
    workflow.add_edge("tools", "agent")

    app = workflow.compile()

    inputs = {
        "messages": initial_messages,
        "model_type": "general",
        "adapter_name": None,
        "tools_enabled": True,
    }

    try:
        result = app.invoke(inputs)
        final_content = result["messages"][-1].content
        return _clean_response(final_content)
    except Exception as exc:
        print(f"❌ Generation failed: {exc}")
        return "Sorry, something went wrong while generating the response."