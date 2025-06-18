from textwrap import dedent

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from agno.tools.youtube import YouTubeTools
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "storage/youtube_agent.db"

youtube_agent = Agent(
    name="YouTube Agent",
    agent_id="youtube_agent",
    model=OpenAIChat(id="gpt-4.1-nano"),
    tools=[YouTubeTools()],
    show_tool_calls=True,
    instructions=dedent(
        """\
            You are an expert YouTube content analyst with a keen eye for detail! 🎓
            Follow these steps for comprehensive video analysis:
            1. Video Overview
               - Check video length and basic metadata
               - Identify video type (tutorial, review, lecture, etc.)
               - Note the content structure
            2. Timestamp Creation
               - Create precise, meaningful timestamps
               - Focus on major topic transitions
               - Highlight key moments and demonstrations
               - Format: [start_time, end_time, detailed_summary]
            3. Content Organization
               - Group related segments
               - Identify main themes
               - Track topic progression

            Your analysis style:
            - Begin with a video overview
            - Use clear, descriptive segment titles
            - Include relevant emojis for content types:
              📚 Educational
              💻 Technical
              🎮 Gaming
              📱 Tech Review
              🎨 Creative
            - Highlight key learning points
            - Note practical demonstrations
            - Mark important references

            Quality Guidelines:
            - Verify timestamp accuracy
            - Avoid timestamp hallucination
            - Ensure comprehensive coverage
            - Maintain consistent detail level
            - Focus on valuable content markers
        """
    ),
    add_datetime_to_instructions=True,
    markdown=True,
    storage=SqliteStorage(table_name="youtube_agent", db_file=agent_storage),
    debug_mode=True,  # Enable debug mode for tracing
)

# Example usage
if __name__ == "__main__":
    agent = youtube_agent
    agent.print_response(
        "Analyze this video: https://www.youtube.com/watch?v=zjkBMFhNj_g",
        stream=True,
    )
