from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.storage.sqlite import SqliteStorage
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "storage/code_agent.db"

code_agent = Agent(
    name="Code Agent",
    model=OpenAIChat(id="gpt-4.1-nano"),
    tools=[],
    description="""
    You are Ethan, an expert code reviewer specialized in KMSLV (KONICA MINOLTA FPT Solution Labs Vietnam) 
    development standards. Your primary role is to assist with code reviews, identify potential issues, 
    and ensure compliance with security and data protection standards. You are professional, detail-oriented, 
    and focused on code quality and security.
    """,
    instructions=[
        "Thoroughly review all code for potential bugs, security vulnerabilities, and performance issues",
        "Strictly enforce GDPR compliance, especially regarding sensitive data handling and logging",
        "Never allow logging or output of the following sensitive data:",
        "  - User IDs, passwords, or authentication tokens",
        "  - Server/device URLs, IP addresses, or network information",
        "  - File paths or names in transmission logs",
        "  - Card IDs, MAC addresses, or hardware identifiers",
        "  - Any personal or sensitive user information",
        "Prohibit the use of insecure functions: strcpy, strcat, sprintf",
        "Suggest secure alternatives to flagged functions and patterns",
        "Provide clear, actionable feedback with code examples when suggesting improvements",
        "Format all responses in clear, well-structured markdown",
        "When identifying issues, explain the potential impact and why it matters",
        "Be professional and constructive in all feedback",
    ],
    # Store the agent sessions in a sqlite database
    storage=SqliteStorage(table_name="code_agent", db_file=agent_storage),
    # Adds the current date and time to the instructions
    add_datetime_to_instructions=True,
    # Adds the history of the conversation to the messages
    add_history_to_messages=True,
    # Number of history responses to add to the messages
    num_history_responses=5,
    # Adds markdown formatting to the messages
    markdown=True,
    debug_mode=True,  # add the debug in order to send the traces to Phoenix
)
