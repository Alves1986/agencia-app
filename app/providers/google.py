import httpx
from .base import BaseProvider


class GoogleProvider(BaseProvider):
    BASE_URL = "https://generativelanguage.googleapis.com/v1beta"

    def get_models(self) -> list[str]:
        return ["gemini-2.0-flash", "gemini-1.5-pro", "gemini-1.5-flash"]

    async def chat(self, messages: list[dict], temperature: float = 0.7) -> str:
        contents = []
        for m in messages:
            role = "user" if m["role"] in ("user", "system") else "model"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        async with httpx.AsyncClient(timeout=120) as client:
            resp = await client.post(
                f"{self.BASE_URL}/models/{self.model or 'gemini-2.0-flash'}:generateContent?key={self.api_key}",
                headers={"content-type": "application/json"},
                json={"contents": contents, "generationConfig": {"temperature": temperature}},
            )
            resp.raise_for_status()
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]

    async def chat_stream(self, messages: list[dict], temperature: float = 0.7):
        contents = []
        for m in messages:
            role = "user" if m["role"] in ("user", "system") else "model"
            contents.append({"role": role, "parts": [{"text": m["content"]}]})

        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                f"{self.BASE_URL}/models/{self.model or 'gemini-2.0-flash'}:streamGenerateContent?key={self.api_key}",
                headers={"content-type": "application/json"},
                json={"contents": contents, "generationConfig": {"temperature": temperature}},
            ) as resp:
                resp.raise_for_status()
                import json
                async for line in resp.aiter_lines():
                    if line.startswith("data: "):
                        data = json.loads(line[6:])
                        if "candidates" in data:
                            yield data["candidates"][0]["content"]["parts"][0]["text"]
