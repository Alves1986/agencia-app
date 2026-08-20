import { describe, expect, it } from "vitest";
import { decryptProviderKey, encryptProviderKey, getKeyHint } from "./crypto";

describe("criptografia de credenciais de provedor", () => {
  it("não mantém a credencial em texto puro e permite recuperá-la apenas no servidor", () => {
    const secret = "sk-cliente-privado-1234";
    const encrypted = encryptProviderKey(secret);

    expect(encrypted).not.toContain(secret);
    expect(decryptProviderKey(encrypted)).toBe(secret);
    expect(getKeyHint(secret)).toBe("••••1234");
  });
});
