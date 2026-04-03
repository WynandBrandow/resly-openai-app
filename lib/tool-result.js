export function normalizeData(payload) {
  if (payload === undefined || payload === null) return null
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data
  return payload
}

export function success(data, message = undefined) {
  const out = {
    success: true,
    data: normalizeData(data),
  }
  if (message) out.message = message
  return out
}

export function failure(message, data = null) {
  return {
    success: false,
    data,
    message,
  }
}

export function ok(data, message = undefined) {
  return success(data, message)
}

export function fail(error, data = null) {
  const message =
    error?.message ||
    (typeof error === 'string' ? error : 'I’m having trouble retrieving that from the system — let me try again.')

  return failure(message, data)
}
