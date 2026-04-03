export function success(data: any) {
  return {
    success: true,
    data: data ?? null,
  }
}

export function failure(message: string) {
  return {
    success: false,
    data: null,
    message,
  }
}
