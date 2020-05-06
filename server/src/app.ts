import express from 'express';
import path from 'path';
import fs from 'fs';
import { STATUS_CODES } from './statusCodes';
import { getVideos } from './helpers/getVideos';
import { getMapFromAbsolutePaths } from './helpers/getMapFromAbsolutePaths';

const BROWSE_DIR = process.env.BROWSE_DIR || process.argv[2];

export const app = express();

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/videos', (_, res) => {
  getVideos(BROWSE_DIR)
    .then(getMapFromAbsolutePaths(BROWSE_DIR))
    .then((videos) => res.send(videos))
    .catch((err) => {
      res
        .status(STATUS_CODES['Internal Server Error'])
        .send(STATUS_CODES[STATUS_CODES['Internal Server Error']]);
      throw err;
    });
});

app.get('/api/playback', (req, res) => {
  const videoPath = req.query.videoPath as string;

  if (!videoPath) {
    res.status(STATUS_CODES['Bad Request']).send(STATUS_CODES[STATUS_CODES['Bad Request']]);
    return;
  }

  const absolutePath = path.resolve(BROWSE_DIR, videoPath);

  fs.stat(absolutePath, (err, stats) => {
    if (err) {
      res
        .status(STATUS_CODES['Internal Server Error'])
        .send(STATUS_CODES[STATUS_CODES['Internal Server Error']]);

      return;
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    if (!range) {
      res.status(STATUS_CODES['Bad Request']).send(STATUS_CODES[STATUS_CODES['Bad Request']]);
      return;
    }

    let [start, end] = range // eslint-disable-line
      .replace(/bytes=/, '')
      .split('-')
      .map(parseInt);

    if (!end) end = fileSize - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(absolutePath, { start, end });

    res.status(STATUS_CODES['Partial Content']).set({
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    file.pipe(res);
  });
});
