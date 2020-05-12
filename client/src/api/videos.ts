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
  const url = new URL(`${API_ROOT}/api/playback`);
  url.searchParams.append('videoPath', videoPath);
  return url;
}

export function getThumbnailApiUrl(thumbnailPath: string): URL {
  const url = new URL(`${API_ROOT}/api/thumbnail`);
  url.searchParams.append('thumbnailPath', thumbnailPath);
  return url;
}
