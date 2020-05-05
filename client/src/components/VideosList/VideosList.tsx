import React from 'react';
import { ErrorText } from 'src/components/ErrorText/ErrorText';
import { fetchVideos } from 'src/api/videos';
import { getBasename } from './getBasename';

export const VideosList: React.FC = () => {
  const { payload: videos, status, error } = fetchVideos();

  return (
    <div>
      <h1>VideosList</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load videos list" />}
      {videos && videos.map((v) => <div key={v}>{getBasename(v)}</div>)}
    </div>
  );
};
