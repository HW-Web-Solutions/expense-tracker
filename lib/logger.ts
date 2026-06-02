type LogContext = Record<string, unknown>

export function logError(source: string, error: unknown, ctx: LogContext = {}) {
  const message = error instanceof Error ? error.message : String(error)
  const stack = error instanceof Error ? error.stack : undefined
  console.error(JSON.stringify({ level: 'error', source, message, stack, ...ctx, ts: new Date().toISOString() }))
}

export function logInfo(source: string, ctx: LogContext = {}) {
  console.log(JSON.stringify({ level: 'info', source, ...ctx, ts: new Date().toISOString() }))
}
