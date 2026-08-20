from abc import ABC, abstractmethod
from typing import AsyncGenerator


class BaseProvider(ABC):
    def __init__(self, api_key: str, model: str = None):
        self.api_key = api_key
        self.model = model

    @abstractmethod
    async def chat(self, messages: list[dict], temperature: float = 0.7) -> str:
        pass

    @abstractmethod
    async def chat_stream(self, messages: list[dict], temperature: float = 0.7) -> AsyncGenerator[str, None]:
        pass

    @abstractmethod
    def get_models(self) -> list[str]:
        pass
