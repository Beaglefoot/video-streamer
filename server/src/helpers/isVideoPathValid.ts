import path from 'path';
import { KNOWN_MIME_TYPES } from '../knownMimeTypes';

export function isVideoPathValid(videoPath: string): boolean {
  const ext = path.extname(videoPath);

  if (!(ext in KNOWN_MIME_TYPES)) return false;
  if (videoPath.includes('..')) return false;

  return true;
}
