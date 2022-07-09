declare module 'zx/experimental' {
  export default any;
  export const spinner = <T>(message: string, f: () => Promise<T>) => T;
}
