// refreshQueue.ts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (error: unknown) => void }> = [];
let refreshController: AbortController | null = null;
const MAX_QUEUE_SIZE = 50; // Prevent memory exhaustion
let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function getIsRefreshing() {
  return isRefreshing;
}

export function enqueueRequest(promiseHandlers: { resolve: (v?: unknown) => void; reject: (e: unknown) => void }) {
  if (failedQueue.length >= MAX_QUEUE_SIZE) {
    promiseHandlers.reject(new Error("Too many requests in queue"));
    return;
  }
  failedQueue.push(promiseHandlers);
}

export function startRefreshing(timeoutMs: number) {
  // Cleanup any previous controller
  if (refreshController) {
    refreshController.abort();
  }
  
  isRefreshing = true;
  refreshController = new AbortController();
  
  // Set timeout to abort refresh request
  if (timeoutMs > 0) {
    refreshTimeoutId = setTimeout(() => {
      if (refreshController) {
        refreshController.abort();
      }
    }, timeoutMs);
  }
}

export function finishRefreshing() {
  isRefreshing = false;
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
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
  // Reject all queued requests on reset
  failedQueue.forEach(({ reject }) => 
    reject(new Error("Request aborted due to system reset"))
  );
  failedQueue = [];
  isRefreshing = false;
  
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId);
    refreshTimeoutId = null;
  }
  
  if (refreshController) {
    refreshController.abort();
    refreshController = null;
  }
}