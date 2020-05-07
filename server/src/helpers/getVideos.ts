import fs from 'fs';
import path from 'path';
import { KNOWN_MIME_TYPES } from '../knownMimeTypes';

export function getVideos(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, 'utf8', (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      Promise.all<{ file: string; stats: fs.Stats }>(
        files
          .map((f) => path.resolve(dir, f))
          .map(
            (file) =>
              new Promise((resolve, reject) => {
                fs.stat(file, (err, stats) => {
                  if (err) return reject(err);

                  resolve({ file, stats });
                });
              })
          )
      )
        .then(
          (files) =>
            files
              .flatMap(({ file, stats }) => {
                if (stats.isFile() && path.extname(file) in KNOWN_MIME_TYPES) return file;
                if (stats.isDirectory()) return getVideos(file);
              })
              .filter(Boolean) as (string | Promise<string[]>)[]
        )
        .then((files) => Promise.all<string | Promise<string[]>>(files))
        .then((files) => files.flat())
        .then(resolve);
    });
  });
}
