/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUD_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}