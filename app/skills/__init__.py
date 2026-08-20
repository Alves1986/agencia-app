from . import agencia, carrosseis

SKILLS = {
    "agencia": agencia,
    "carrosseis": carrosseis,
}

def get_skill_list():
    return [
        {"id": key, "name": mod.NAME, "description": mod.DESCRIPTION, "icon": mod.ICON}
        for key, mod in SKILLS.items()
    ]

def get_skill_prompt(skill_id: str) -> str:
    return SKILLS[skill_id].SYSTEM_PROMPT
