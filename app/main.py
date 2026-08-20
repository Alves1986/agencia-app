import json
import os
import sys
from pathlib import Path
from contextlib import asynccontextmanager

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, StreamingResponse
from pydantic import BaseModel

from providers import get_provider, PROVIDER_NAMES
from skills import get_skill_list, get_skill_prompt

CONFIG_PATH = Path(__file__).parent.parent / "config.json"
STORAGE_DIR = Path(__file__).parent / "storage"
STORAGE_DIR.mkdir(exist_ok=True)


def load_config():
    if CONFIG_PATH.exists():
        return json.loads(CONFIG_PATH.read_text(encoding="utf-8"))
    return {"provider": "", "api_key": "", "model": ""}


def save_config(config: dict):
    CONFIG_PATH.write_text(json.dumps(config, indent=2, ensure_ascii=False), encoding="utf-8")


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="Agencia de Anuncios", lifespan=lifespan)

FRONTEND_DIR = Path(__file__).parent.parent / "frontend"


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    skill: str


class ConfigRequest(BaseModel):
    provider: str
    api_key: str
    model: str


class SaveFileRequest(BaseModel):
    filename: str
    content: str


@app.get("/api/config")
async def get_config():
    config = load_config()
    return {
        "provider": config["provider"],
        "model": config["model"],
        "has_key": bool(config["api_key"]),
        "providers": PROVIDER_NAMES,
    }


@app.post("/api/config")
async def set_config(req: ConfigRequest):
    config = load_config()
    config["provider"] = req.provider
    config["api_key"] = req.api_key
    config["model"] = req.model
    save_config(config)
    return {"ok": True}


@app.get("/api/skills")
async def list_skills():
    return get_skill_list()


@app.post("/api/chat")
async def chat(req: ChatRequest):
    config = load_config()
    if not config["api_key"]:
        raise HTTPException(400, "Configure sua API key primeiro")

    provider = get_provider(config["provider"], config["api_key"], config["model"] or None)

    system_prompt = get_skill_prompt(req.skill)
    messages = [{"role": "system", "content": system_prompt}]
    for m in req.messages:
        messages.append({"role": m.role, "content": m.content})

    try:
        result = await provider.chat(messages)
        return {"response": result}
    except Exception as e:
        raise HTTPException(500, f"Erro do provider: {str(e)}")


@app.post("/api/chat/stream")
async def chat_stream(req: ChatRequest):
    config = load_config()
    if not config["api_key"]:
        raise HTTPException(400, "Configure sua API key primeiro")

    provider = get_provider(config["provider"], config["api_key"], config["model"] or None)

    system_prompt = get_skill_prompt(req.skill)
    messages = [{"role": "system", "content": system_prompt}]
    for m in req.messages:
        messages.append({"role": m.role, "content": m.content})

    async def generate():
        try:
            async for chunk in provider.chat_stream(messages):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.post("/api/storage/save")
async def save_file(req: SaveFileRequest):
    filepath = STORAGE_DIR / req.filename
    filepath.write_text(req.content, encoding="utf-8")
    return {"ok": True, "path": str(filepath)}


@app.get("/api/storage/list")
async def list_files():
    files = []
    for f in STORAGE_DIR.iterdir():
        if f.is_file():
            files.append({"name": f.name, "size": f.stat().st_size})
    return files


@app.get("/api/storage/{filename}")
async def read_file(filename: str):
    filepath = STORAGE_DIR / filename
    if not filepath.exists():
        raise HTTPException(404, "Arquivo nao encontrado")
    return {"content": filepath.read_text(encoding="utf-8")}


app.mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static")


@app.get("/")
async def index():
    return FileResponse(str(FRONTEND_DIR / "index.html"))
