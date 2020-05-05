import path from 'path';

interface INameRelativeMap {
  [name: string]: string;
}

export function getMapFromAbsolutePaths(fromDir: string) {
  return (videos: string[]) =>
    videos.reduce<INameRelativeMap>((result, v) => {
      result[path.basename(v)] = path.relative(fromDir, v);
      return result;
    }, {});
}
