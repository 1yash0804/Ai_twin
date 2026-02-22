import asyncio
from app.pipeline.contracts import NormalizedMessage


class InMemoryMessageQueue:
    def __init__(self):
        self._queue: asyncio.Queue[NormalizedMessage] = asyncio.Queue()

    async def publish(self, message: NormalizedMessage):
        await self._queue.put(message)

    async def consume(self) -> NormalizedMessage:
        return await self._queue.get()


message_queue = InMemoryMessageQueue()
