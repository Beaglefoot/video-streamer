import { EventEmitter } from 'events';
import path from 'path';
import fs from 'fs';
import { RequestHandler } from 'express';
import { KNOWN_MIME_TYPES } from '../knownMimeTypes';
import { ThumbnailBuilderService } from './ThumbnailBuilderService';

interface INameRelativeMap {
  [name: string]: string;
}

type TVideoMetaEvents = 'finish' | 'found';
type TStatus = 'pending' | 'settled';

const MAX_LISTENERS = 50;

export class VideoMetaService {
  public status: TStatus = 'settled';
  public map: INameRelativeMap = {};
  public error: Error;

  private emitter: EventEmitter;
  private readonly browseDir: string;
  private thumbnailBuilderService: ThumbnailBuilderService;

  constructor(browseDir: string) {
    this.emitter = new EventEmitter();
    this.emitter.setMaxListeners(MAX_LISTENERS);
    this.browseDir = browseDir;
    this.thumbnailBuilderService = new ThumbnailBuilderService();
    this.initSearch().then(() => {
      Object.values(this.map).forEach((relativePath) => {
        this.thumbnailBuilderService.build(path.resolve(browseDir, relativePath));
      });
    });
  }

  public once(event: TVideoMetaEvents, listener: <T>(arg: T) => void): void {
    this.emitter.once(event, listener);
  }

  public awaitFinish: RequestHandler = (_, __, next): void => {
    if (this.status === 'settled') return next();

    this.once('finish', next);
  };

  private async initSearch(): Promise<void> {
    this.status = 'pending';

    let videos;

    try {
      videos = await this.getVideos(this.browseDir);
      this.map = this.getMapFromAbsolutePaths(videos);
    } catch (err) {
      this.error = err;
    } finally {
      this.status = 'settled';
      this.emitter.emit('finish');
    }
  }

  private async getVideos(dir: string): Promise<string[]> {
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
                  if (stats.isDirectory()) return this.getVideos(file);
                })
                .filter(Boolean) as (string | Promise<string[]>)[]
          )
          .then((files) => Promise.all<string | Promise<string[]>>(files))
          .then((files) => files.flat())
          .then(resolve);
      });
    });
  }

  private getMapFromAbsolutePaths(videos: string[]): INameRelativeMap {
    const map: INameRelativeMap = {};

    videos.forEach((v) => {
      map[path.basename(v)] = path.relative(this.browseDir, v);
    });

    return map;
  }
}
