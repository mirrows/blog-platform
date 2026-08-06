/// <reference types="nuxt" />

declare module 'vue' {
  export interface ComponentCustomProperties {
    $fetch: typeof $fetch
  }
}

declare namespace NodeJS {
  interface Process {
    client: boolean
    server: boolean
  }
}

export {}
