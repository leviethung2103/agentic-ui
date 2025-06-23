import httpx
from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.tools import tool


@tool(
    name="fetch_hackernews_stories",  # Custom name for the tool (otherwise the function name is used)
    description="Get top stories from Hacker News",  # Custom description (otherwise the function docstring is used)
    show_result=True,  # Show result after function call
    requires_confirmation=True,  # Requires user confirmation before execution
)
def get_top_hackernews_stories(num_stories: int = 5) -> str:
    """
    Fetch the top stories from Hacker News.

    Args:
        num_stories: Number of stories to fetch (default: 5)

    Returns:
        str: The top stories in text format
    """
    # Fetch top story IDs
    response = httpx.get("https://hacker-news.firebaseio.com/v0/topstories.json")
    story_ids = response.json()

    # Get story details
    stories = []
    for story_id in story_ids[:num_stories]:
        story_response = httpx.get(f"https://hacker-news.firebaseio.com/v0/item/{story_id}.json")
        story = story_response.json()
        stories.append(f"{story.get('title')} - {story.get('url', 'No URL')}")

    return "\n".join(stories)


agent = Agent(model=OpenAIChat(id="gpt-4.1-nano", max_completion_tokens=500), tools=[get_top_hackernews_stories])
agent.print_response("Show me the top news from Hacker News", stream=True)
