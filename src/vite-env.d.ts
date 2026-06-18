/// <reference types="vite/client" />

/**
 * Represents the environment variables available in the application.
 */
interface ImportMetaEnv {
  /** The base URL of the API. */
  readonly VITE_API_URL: string;
  /** The name of the application. */
  readonly VITE_APP_NAME: string;
  /** The version of the application. */
  readonly VITE_APP_VERSION: string;
}

/**
 * Describes the metadata of the import statement, including Vite-specific environment variables.
 */
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
