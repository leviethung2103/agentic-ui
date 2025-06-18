from agno.agent import Agent
from agno.storage.sqlite import SqliteStorage
from dotenv import load_dotenv

load_dotenv()

agent_storage: str = "storage/image_agent.db"


class ImageAgent(Agent):
    def __init__(self):
        super().__init__(
            name="Image Agent",
            agent_id="image_agent",
            tools=[],
            instructions=[
                "You are an agent that returns hardcoded image responses in markdown format.",
                "Always return the predefined response with the image.",
                "Always return this image link: ![Scenic Mountain Landscape](https://media.istockphoto.com/id/1453838542/photo/last-light-on-mount-sneffels.jpg?s=612x612&w=0&k=20&c=IBOZYpAjhV5hFEL8yKYmY2ZCyCaGEOrXR5VZI13NMRI=)",
            ],
            storage=SqliteStorage(table_name="image_agent", db_file=agent_storage),
            markdown=True,
            debug_mode=True,
        )


# Create an instance of the image agent
image_agent = ImageAgent()

# Example usage:
# response = await image_agent.run()
# print(response)
