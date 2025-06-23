import asyncio

from agno.agent import Agent
from agno.models.openai import OpenAIChat
from agno.team import Team

agent_1 = Agent(model=OpenAIChat(id="gpt-4.1-nano"), name="News Agent", role="Get the latest news")

agent_2 = Agent(model=OpenAIChat(id="gpt-4.1-nano"), name="Weather Agent", role="Get the weather for the next 7 days")

team = Team(
    model=OpenAIChat(id="gpt-4.1-nano"),
    name="News and Weather Team",
    mode="coordinate",
    show_tool_calls=True,
    members=[agent_1, agent_2],
    debug_mode=True,
    markdown=True,
)

response = team.run("What is the weather in Tokyo?")

# Synchronous execution
result = team.run("What is the weather in New York?")
print(result)


async def main():
    result = await team.arun("What is the weather in New York?")
    print(result)


asyncio.run(main())

# # Streaming responses
# for chunk in team.run("What is the weather in Tokyo?", stream=True):
#     print(chunk.content, end="", flush=True)

# # Asynchronous streaming
# async for chunk in await team.arun("What is the weather in Tokyo?", stream=True):
#     print(chunk.content, end="", flush=True)
