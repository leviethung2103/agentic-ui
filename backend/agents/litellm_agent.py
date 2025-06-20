from agno.agent import Agent
from agno.models.litellm import LiteLLM

agent = Agent(
    model=LiteLLM(
        id="unified-endpoint",
        name="LiteLLM"
    ),
    markdown=True,
)

agent.print_response("Share a 2 sentence horror story")
