export function ok(data) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(data, null, 2)
      }
    ],
    structuredContent: data
  };
}

export function fail(error) {
  return {
    content: [
      {
        type: "text",
        text: `Error: ${error instanceof Error ? error.message : String(error)}`
      }
    ],
    isError: true
  };
}
