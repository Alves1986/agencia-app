from .openai import OpenAIProvider
from .anthropic import AnthropicProvider
from .google import GoogleProvider
from .deepseek import DeepSeekProvider
from .groq import GroqProvider
from .base import BaseProvider

PROVIDERS = {
    "openai": OpenAIProvider,
    "anthropic": AnthropicProvider,
    "google": GoogleProvider,
    "deepseek": DeepSeekProvider,
    "groq": GroqProvider,
}

PROVIDER_NAMES = {
    "openai": "OpenAI (GPT-4o)",
    "anthropic": "Anthropic (Claude)",
    "google": "Google (Gemini)",
    "deepseek": "DeepSeek",
    "groq": "Groq (Llama/Mixtral)",
}


def get_provider(provider_name: str, api_key: str, model: str = None) -> BaseProvider:
    if provider_name not in PROVIDERS:
        raise ValueError(f"Provider desconhecido: {provider_name}")
    return PROVIDERS[provider_name](api_key=api_key, model=model)
