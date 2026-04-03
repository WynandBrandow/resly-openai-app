export function success(data) {
  return { success: true, data: data ?? null }
}

export function failure(message) {
  return { success: false, data: null, message }
}
