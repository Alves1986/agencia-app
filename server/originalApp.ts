import axios from "axios";

const REQUEST_TIMEOUT_MS = 7_000;

type OriginalConfig = {
  provider?: string;
  model?: string;
  has_key?: boolean;
  providers?: Record<string, string>;
};

type OriginalSkill = {
  id?: string;
  name?: string;
  description?: string;
};

type OriginalFile = {
  name: string;
  size?: number;
};

const unsafeHosts = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);

function isPrivateIpv4(host: string) {
  const parts = host.split(".").map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || parts[0] === 0 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168);
}

export function normalizeOriginalAppUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error("Informe uma URL pública válida para a instância original.");
  }

  if (url.protocol !== "https:") throw new Error("A integração aceita apenas URLs HTTPS públicas.");
  if (url.username || url.password) throw new Error("A URL de integração não pode conter credenciais.");
  if (unsafeHosts.has(url.hostname) || url.hostname.endsWith(".local") || isPrivateIpv4(url.hostname)) {
    throw new Error("A integração precisa apontar para um servidor público, não para um endereço local.");
  }

  url.pathname = url.pathname.replace(/\/$/, "");
  url.search = "";
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

function originalClient(baseUrl: string) {
  return axios.create({
    baseURL: baseUrl,
    timeout: REQUEST_TIMEOUT_MS,
    maxRedirects: 0,
    validateStatus: status => status >= 200 && status < 300,
  });
}

function compactError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) return `A instância respondeu com status ${error.response.status}.`;
    if (error.code === "ECONNABORTED") return "A conexão excedeu o tempo limite.";
  }
  return "Não foi possível alcançar a instância original.";
}

export async function inspectOriginalApp(baseUrl: string) {
  const safeBaseUrl = normalizeOriginalAppUrl(baseUrl);
  const client = originalClient(safeBaseUrl);
  try {
    const [configResponse, skillsResponse, filesResponse] = await Promise.all([
      client.get<OriginalConfig>("/api/config"),
      client.get<OriginalSkill[]>("/api/skills"),
      client.get<OriginalFile[]>("/api/storage/list"),
    ]);

    return {
      baseUrl: safeBaseUrl,
      config: {
        provider: configResponse.data.provider ?? null,
        model: configResponse.data.model ?? null,
        configured: Boolean(configResponse.data.has_key),
        providers: configResponse.data.providers ?? {},
      },
      skills: Array.isArray(skillsResponse.data) ? skillsResponse.data : [],
      files: Array.isArray(filesResponse.data) ? filesResponse.data : [],
    };
  } catch (error) {
    throw new Error(compactError(error));
  }
}
