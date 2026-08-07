declare global {
  interface Window {
    html2canvas: (element: HTMLElement) => Promise<{
      toDataURL: (type?: string) => string
    }>
  }
}

export {}
