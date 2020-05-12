import { useFetch, IFetchStatus } from 'src/hooks/useFetch';

export interface INameRelativeMap {
  [name: string]: {
    videoPath: string;
    thumbnailPath: string;
  };
}

export function fetchVideos(): IFetchStatus<INameRelativeMap> {
  return useFetch(`${API_ROOT}/api/videos`);
}

export function getPlaybackApiUrl(videoPath: string): URL {
  return new URL(`${API_ROOT}/api/playback/${videoPath}`);
}

export function getThumbnailApiUrl(thumbnailPath: string): URL {
  return new URL(`${API_ROOT}/api/thumbnail/${thumbnailPath}`);
}
