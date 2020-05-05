import express from 'express';
import path from 'path';
import { STATUS_CODES } from './statusCodes';
import { getVideos } from './helpers/getVideos';

const BROWSE_DIR = process.env.BROWSE_DIR || process.argv[2];

export const app = express();

app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/api/videos', (_, res) => {
  getVideos(BROWSE_DIR)
    .then((videos) => videos.map((v) => path.relative(BROWSE_DIR, v)))
    .then((videos) => res.send(videos))
    .catch((err) => {
      res
        .status(STATUS_CODES['Internal Server Error'])
        .send(STATUS_CODES[STATUS_CODES['Internal Server Error']]);
      throw err;
    });
});
