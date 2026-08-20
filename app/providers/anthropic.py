import httpx
from .base import BaseProvider


class AnthropicProvider(BaseProvider):
    BASE_URL = "https://api.anthropic.com/v1"

    def get_models(self) -> list[str]:
        return ["claude-sonnet-4-20250514", "claude-3-5-haiku-20241022", "claude-3-opus-20240229"]

    async def chat(self, messages: list[dict], temperature: float = 0.7) -> str:
        system_msg = ""
        chat_messages = []
        for m in messages:
            if m["role"] == "system":
                system_msg = m["content"]
            else:
                chat_messages.append(m)

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.BASE_URL}/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": self.model or "claude-sonnet-4-20250514",
                    "max_tokens": 8192,
                    "system": system_msg,
                    "messages": chat_messages,
                    "temperature": temperature,
                },
            )
            resp.raise_for_status()
            return resp.json()["content"][0]["text"]

    async def chat_stream(self, messages: list[dict], temperature: float = 0.7):
        system_msg = ""
        chat_messages = []
        for m in messages:
            if m["role"] == "system":
                system_msg = m["content"]
            else:
                chat_messages.append(m)

        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.BASE_URL}/messages",
                headers={
                    "x-api-key": self.api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": self.model or "claude-sonnet-4-20250514",
                    "max_tokens": 8192,
                    "system": system_msg,
                    "messages": chat_messages,
                    "temperature": temperature,
                    "stream": True,
                },
            ) as resp:
                resp.raise_for_status()
                import json
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data = json.loads(line[6:])
                        if data.get("type") == "content_block_delta":
                            yield data["delta"].get("text", "")
