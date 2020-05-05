export function getBasename(path: string): string {
  return path.split('/').slice(-1)[0];
}
