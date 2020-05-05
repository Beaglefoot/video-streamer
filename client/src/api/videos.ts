import { useFetch, IFetchStatus } from 'src/hooks/useFetch';

export function fetchVideos(): IFetchStatus<string[]> {
  return useFetch('http://localhost:3000/api/videos');
}
