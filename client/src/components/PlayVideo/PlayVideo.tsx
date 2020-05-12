import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { VideosContext } from '../App/App';
import { ErrorText } from '../ErrorText/ErrorText';
import { getPlaybackApiUrl } from 'src/api/videos';

export const PlayVideo: React.FC = () => {
  let videoName: string;
  let url: URL;

  const { payload: videos, status, error } = useContext(VideosContext);
  const { search } = useLocation();

  if (videos) {
    videoName = new URLSearchParams(search).get('videoName');
    url = getPlaybackApiUrl(videos[videoName].videoPath);
  }

  return (
    <React.Fragment>
      <h1>{videoName}</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load video" />}
      {videos && (
        <video id="video-player" controls preload="metadata">
          <source src={url.toString()} />
        </video>
      )}
    </React.Fragment>
  );
};
