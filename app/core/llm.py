import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.core.tools import get_tools

# --- LANGGRAPH IMPORTS ---
from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage
from typing import TypedDict, Annotated, Sequence
import operator
from langchain_core.messages import BaseMessage

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# 1. Define the State (The "Memory" of the current execution)
class AgentState(TypedDict):
    # 'messages' holds the full conversation + tool results
    # operator.add is a reducer: it appends new messages to the list instead of overwriting
    messages: Annotated[Sequence[BaseMessage], operator.add]

def get_llm():
    if not GROQ_API_KEY:
       raise RuntimeError("GROQ_API_KEY missing")
    # We use the 70b model because LangGraph logic requires smarter reasoning
    return ChatGroq(
        temperature=0, 
        model_name="llama-3.1-8b-instant", 
        groq_api_key=GROQ_API_KEY
    )

# 2. Define the 'Agent' Node (The Brain)
def call_model(state: AgentState):
    messages = state['messages']
    llm = get_llm()
    tools = get_tools()
    
    # Bind tools to the LLM so it knows it can use them
    llm_with_tools = llm.bind_tools(tools)
    
    response = llm_with_tools.invoke(messages)
    
    # Return the AI's decision (either text or a tool call)
    return {"messages": [response]}

# 3. Define the Logic: Should we continue to tools or end?
def should_continue(state: AgentState):
    last_message = state['messages'][-1]
    
    # If the LLM returned a tool_call, go to "tools" node
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    # Otherwise, stop (we have an answer)
    return END

# 4. The Graph Builder
def generate_answer(query: str, context: list, history: list | None = None):
    if history is None:
        history = []

    
    # -- SETUP CONTEXT & PROMPT --
    context_text = "\n\n".join([f"- {item['text']}" for item in context])
    
    # Reconstruct history objects for LangGraph
    formatted_history = []
    for msg in history:
        if msg['role'] == 'user':
            formatted_history.append(HumanMessage(content=msg['content']))
        else:
            formatted_history.append(AIMessage(content=msg['content']))

    # The System Prompt (Identity)
    system_msg = SystemMessage(content=f"""
    You are the AI Twin of a software engineer named Yash.
    
    YOUR KNOWLEDGE BASE:
    1. **Internal Memory:** {context_text}
    2. **External Tools:** Live Web Search (Tavily).

    RULES:
    - Use Internal Memory FIRST. If the answer is there, use it.
    - If you need live data (weather, news, "who is"), call the search tool.
    - Be direct, technical, and concise.
    """)
    
    # Prepare the initial state
    initial_messages = [system_msg] + formatted_history + [HumanMessage(content=query)]

    # -- BUILD THE GRAPH --
    workflow = StateGraph(AgentState)

    # Add Nodes
    workflow.add_node("agent", call_model)
    workflow.add_node("tools", ToolNode(get_tools()))

    # Add Edges
    workflow.set_entry_point("agent")
    
    # Conditional Edge: Agent -> (Tools OR End)
    workflow.add_conditional_edges(
        "agent",
        should_continue,
        {
            "tools": "tools",
            END: END
        }
    )
    
    # Normal Edge: Tools -> Agent (Loop back to digest results)
    workflow.add_edge("tools", "agent")

    # Compile the graph
    app = workflow.compile()

    # -- RUN IT --
    # stream_mode="values" gives us the final state
    result = app.invoke({"messages": initial_messages})
    
    # The last message is the final answer
    return result['messages'][-1].content