import express from 'express';
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
