export const isProduction = typeof window !== 'undefined' && !window.location.hostname.includes('localhost');
const PROXY_URL = '/api/claude';
const DIRECT_URL = 'https://api.anthropic.com/v1/messages';

function safeStorage() {
  try { return typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function' ? localStorage : null; } catch { return null; }
}

let apiKey = safeStorage()?.getItem('claude_api_key') || '';

export function setApiKey(key: string): void {
  apiKey = key;
  safeStorage()?.setItem('claude_api_key', key);
}

export function getApiKey(): string {
  return apiKey;
}

export function hasApiKey(): boolean {
  if (isProduction) return true;
  return apiKey.length > 0;
}

export async function callClaude(prompt: string): Promise<string> {
  if (isProduction) {
    return callViaProxy(prompt);
  }
  return callDirect(prompt);
}

async function callViaProxy(prompt: string): Promise<string> {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(typeof error.error === 'string' ? error.error : `API 오류: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

async function callDirect(prompt: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API 키가 설정되지 않았습니다. 설정에서 Claude API 키를 입력해주세요.');
  }

  const response = await fetch(DIRECT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(`Claude API 오류: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || '';
}

export function parseJsonResponse<T>(response: string): T {
  // 코드블록 안의 JSON 우선 추출
  const codeBlockMatch = response.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlockMatch) {
    return JSON.parse(codeBlockMatch[1].trim());
  }

  // 중괄호 깊이를 추적해서 최외곽 JSON 객체를 정확히 추출
  const start = response.indexOf('{');
  if (start === -1) {
    throw new Error('응답에서 JSON을 찾을 수 없습니다.');
  }

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < response.length; i++) {
    const ch = response[i];
    if (escape) { escape = false; continue; }
    if (ch === '\\') { escape = true; continue; }
    if (ch === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (ch === '{') depth++;
    if (ch === '}') { depth--; if (depth === 0) return JSON.parse(response.slice(start, i + 1)); }
  }

  throw new Error('응답에서 완전한 JSON을 찾을 수 없습니다.');
}
