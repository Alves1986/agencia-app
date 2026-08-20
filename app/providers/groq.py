import httpx
from .base import BaseProvider


class GroqProvider(BaseProvider):
    BASE_URL = "https://api.groq.com/openai/v1"

    def get_models(self) -> list[str]:
        return ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"]

    async def chat(self, messages: list[dict], temperature: float = 0.7) -> str:
        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model or "llama-3.3-70b-versatile", "messages": messages, "temperature": temperature},
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]

    async def chat_stream(self, messages: list[dict], temperature: float = 0.7):
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.BASE_URL}/chat/completions",
                headers={"Authorization": f"Bearer {self.api_key}"},
                json={"model": self.model or "llama-3.3-70b-versatile", "messages": messages, "temperature": temperature, "stream": True},
            ) as resp:
                resp.raise_for_status()
                async for line in resp.aiter_lines():
                    if line.startswith("data: ") and line != "data: [DONE]":
                        import json
                        data = json.loads(line[6:])
                        delta = data["choices"][0].get("delta", {})
                        if "content" in delta:
                            yield delta["content"]
