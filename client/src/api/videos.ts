import { useFetch, IFetchStatus } from 'src/hooks/useFetch';

export function fetchVideos(): IFetchStatus<string[]> {
  return useFetch(`${API_ROOT}/api/videos`);
}
