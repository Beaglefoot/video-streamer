import express from 'express';
import path from 'path';
import fs from 'fs';
import { STATUS_CODES } from './statusCodes';
import { isVideoPathValid } from './helpers/isVideoPathValid';
import { KNOWN_MIME_TYPES } from './knownMimeTypes';
import { VideoMetaService } from './services/VideoMetaService';

const BROWSE_DIR = process.env.BROWSE_DIR || process.argv[2];
const videoMetaService = new VideoMetaService(BROWSE_DIR);

export const app = express();

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/videos', videoMetaService.awaitFinish, (_, res) => {
  if (videoMetaService.error) {
    return res
      .status(STATUS_CODES['Internal Server Error'])
      .send(STATUS_CODES[STATUS_CODES['Internal Server Error']]);
  }

  res.send(videoMetaService.map);
});

app.get('/api/playback', (req, res) => {
  const videoPath = req.query.videoPath as string;

  if (!videoPath || !isVideoPathValid(videoPath)) {
    console.log(isVideoPathValid(videoPath));
    res.status(STATUS_CODES['Bad Request']).send(STATUS_CODES[STATUS_CODES['Bad Request']]);
    return;
  }

  const ext = path.extname(videoPath) as keyof typeof KNOWN_MIME_TYPES;
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
      'Content-Type': KNOWN_MIME_TYPES[ext],
    });

    file.pipe(res);
  });
});
