import { spawn } from 'child_process';
import path from 'path';

const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_MINUTE = 60;

export class ThumbnailBuilderService {
  public async build(absoluteVideoPath: string): Promise<number> {
    const outputPath = path.resolve(path.dirname(absoluteVideoPath), 'thumbnail.png');

    const fileMeta = await this.getExifFileMeta(absoluteVideoPath);
    const duration = this.getDurationFromExif(fileMeta);
    const durationMiddle = this.getDurationAsString(Math.floor(duration / 2)); // eslint-disable-line

    const ffmpeg = spawn(
      'ffmpeg',
      [
        '-ss',
        durationMiddle,
        '-i',
        absoluteVideoPath,
        '-y',
        '-vframes',
        '1',
        '-vf',
        'scale=-1:300',
        outputPath,
      ],
      { detached: true }
    );

    let error = '';

    ffmpeg.stderr.on('data', (data) => (error += data.toString()));

    return new Promise((resolve, reject) => {
      ffmpeg.on('close', (code) => {
        if (code) {
          console.trace('\nError:', error);
          return reject(code);
        }

        resolve(code);
      });
    });
  }

  private getExifFileMeta(absoluteVideoPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const exiftool = spawn('exiftool', [absoluteVideoPath]);
      let fileMeta = '';
      let error = '';

      exiftool.stdout.on('data', (data) => (fileMeta += data.toString()));
      exiftool.stderr.on('data', (data) => (error += data.toString()));

      exiftool.on('close', (code) => {
        if (code) {
          console.trace('\nError:', error);
          return reject(code);
        }
        resolve(fileMeta);
      });
    });
  }

  private getDurationFromExif(fileMeta: string): number {
    const duration = fileMeta
      .split('\n')
      .find((line) => line.startsWith('Duration'))
      ?.split(':')
      .slice(1)
      .map(Number);

    return duration
      ? duration[0] * SECONDS_IN_HOUR + duration[1] * SECONDS_IN_MINUTE + duration[2]
      : 0;
  }

  private getDurationAsString(duration: number): string {
    return [SECONDS_IN_HOUR, SECONDS_IN_MINUTE, 1]
      .reduce(
        (res, divisor) => {
          const timePart = Math.floor(res.duration / divisor);
          res.duration %= divisor;
          res.timeParts.push(timePart.toString().padStart(2, '0')); // eslint-disable-line
          return res;
        },
        {
          duration,
          timeParts: [] as string[],
        }
      )
      .timeParts.join(':');
  }
}
