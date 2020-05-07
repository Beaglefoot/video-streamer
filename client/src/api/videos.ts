import { useFetch, IFetchStatus } from 'src/hooks/useFetch';

export interface INameRelativeMap {
  [name: string]: string;
}

export function fetchVideos(): IFetchStatus<INameRelativeMap> {
  return useFetch(`${API_ROOT}/api/videos`);
}

export function getPlaybackApiUrl(): URL {
  return new URL(`${API_ROOT}/api/playback`);
}
