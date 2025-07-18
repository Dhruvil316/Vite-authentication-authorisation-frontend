
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: unknown) => void }> = [];
let refreshController: AbortController | null = null;

export function getIsRefreshing() {
  return isRefreshing;
}

export function enqueueRequest(promiseHandlers: { resolve: (v?: unknown) => void; reject: (e: unknown) => void }) {
  failedQueue.push(promiseHandlers);
}

export function startRefreshing() {
  isRefreshing = true;
  refreshController = new AbortController();
}

export function finishRefreshing() {
  isRefreshing = false;
  refreshController = null;
}

export function getRefreshSignal(): AbortSignal | undefined {
  return refreshController?.signal;
}

export function processQueue(error: unknown, token?: string) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
}

export function resetQueue() {
  failedQueue = [];
  isRefreshing = false;
  if (refreshController) {
    refreshController.abort();
    refreshController = null;
  }
}
