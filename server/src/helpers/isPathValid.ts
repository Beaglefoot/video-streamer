import { extname } from 'path';
import { VIDEO_MIME_TYPES } from '../enums/videoMimeTypes';
import { IMAGE_MIME_TYPES } from '../enums/imageMimeTypes';

export function isPathValid(path: string): boolean {
  const ext = extname(path);

  if (!(ext in VIDEO_MIME_TYPES) && !(ext in IMAGE_MIME_TYPES)) return false;
  if (path.includes('..')) return false;

  return true;
}
