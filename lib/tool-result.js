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
