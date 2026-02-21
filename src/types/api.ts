export interface PromiseCallback {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}
