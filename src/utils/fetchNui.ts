/**
 * Wrapper em torno da API fetch configurada para NUI do FiveM
 * No ecossistema NPWD, as requisições devem ir para a rota específica do recurso:
 * https://forge-npwd-housing/<eventName>
 * @param eventName - Nome do callback RegisterNUICallback
 * @param data - Dados enviados no body
 * @param mockResp - Resposta simulada para navegador/dev
 */
import { isEnvBrowser } from './misc';

const RESOURCE_NAME = 'forge-npwd-housing';

export async function fetchNui<T = any, D = any>(
  eventName: string,
  data?: D,
  mockResp?: T
): Promise<T> {
  if (isEnvBrowser()) {
    if (mockResp !== undefined) return mockResp;
    console.debug(`[MOCK fetchNui] Event: ${eventName}`, data);
    return Promise.resolve({ status: 'ok', mock: true } as unknown as T);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  try {
    const resp = await fetch(`https://${RESOURCE_NAME}/${eventName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data ?? {}),
      signal: controller.signal,
    });

    if (!resp.ok) {
      throw new Error(`Falha na resposta NUI (${resp.status}): ${resp.statusText}`);
    }

    return (await resp.json()) as T;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('A consulta do imóvel demorou demais. Tente novamente.');
    }
    console.error(`[forge-npwd-housing] Erro ao chamar NUI ${eventName}:`, error);
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
}

export default fetchNui;
