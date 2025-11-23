const BASE_URL = import.meta.env.VITE_AI_BASE_URL as string | undefined;
const API_KEY = import.meta.env.VITE_AI_API_KEY as string | undefined;
const DEFAULT_MODEL = (import.meta.env.VITE_AI_MODEL as string | undefined) || 'gpt-4.1-mini';

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractText(data: any): string | null {
  try {
    if (data && Array.isArray(data.output) && data.output[0] && Array.isArray(data.output[0].content)) {
      const item = data.output[0].content.find((c: any) => typeof c?.text === 'string');
      if (item?.text) return item.text as string;
    }
    if (typeof data?.output_text === 'string') return data.output_text as string;
    if (typeof data?.text === 'string') return data.text as string;
    if (typeof data?.text?.text === 'string') return data.text.text as string;
    return null;
  } catch {
    return null;
  }
}

export class AiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    if (!baseUrl && !BASE_URL) throw new Error('缺少 VITE_AI_BASE_URL');
    if (!apiKey && !API_KEY) throw new Error('缺少 VITE_AI_API_KEY');
    this.baseUrl = baseUrl || BASE_URL!;
    this.apiKey = apiKey || API_KEY!;
  }

  async respond(input: string, opts?: { model?: string; signal?: AbortSignal; timeoutMs?: number }): Promise<string> {
    const model = opts?.model || DEFAULT_MODEL;
    const controller = new AbortController();
    const signal = opts?.signal || controller.signal;
    const timeout = opts?.timeoutMs ?? 15000;
    const timer = setTimeout(() => controller.abort(), opts?.signal ? 0 : timeout);
    try {
      const url = `${this.baseUrl}/v1/responses`;
      const body = JSON.stringify({ model, input });
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      } as Record<string, string>;
      const text = await this.requestWithRetry(url, { method: 'POST', headers, body, signal }, 3);
      return text;
    } finally {
      clearTimeout(timer);
    }
  }

  private async requestWithRetry(url: string, init: RequestInit, maxRetries: number): Promise<string> {
    let attempt = 0;
    let lastError: any = null;
    let backoff = 1000;
    while (attempt <= maxRetries) {
      try {
        const res = await fetch(url, init);
        if (!res.ok) {
          if (res.status === 429 || (res.status >= 500 && res.status < 600)) {
            if (attempt === maxRetries) throw new Error(`请求失败（状态码${res.status}）`);
            await delay(backoff);
            backoff *= 2;
            attempt += 1;
            continue;
          }
          throw new Error(`请求失败（状态码${res.status}）`);
        }
        const data = await res.json();
        const text = extractText(data);
        if (text) return text;
        throw new Error('响应解析失败');
      } catch (e: any) {
        lastError = e;
        if (e?.name === 'AbortError') throw new Error('请求已取消或超时');
        if (attempt === maxRetries) throw lastError;
        await delay(backoff);
        backoff *= 2;
        attempt += 1;
      }
    }
    throw lastError || new Error('请求失败');
  }
}

export const aiClient = new AiClient();