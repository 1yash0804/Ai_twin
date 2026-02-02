from langchain_community.tools.tavily_search import TavilySearchResults

def get_tools():
    """
    Returns the tools available to the Agent.
    """
    # Tavily is built for agents: it returns clean JSON, not raw HTML.
    search_tool = TavilySearchResults(max_results=3)
    
    return [search_tool]