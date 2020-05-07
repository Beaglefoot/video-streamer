import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { VideosContext } from '../App/App';
import { ErrorText } from '../ErrorText/ErrorText';

export const PlayVideo: React.FC = () => {
  let videoName: string;
  let url: URL;

  const { payload: videoPaths, status, error } = useContext(VideosContext);
  const { search } = useLocation();

  if (videoPaths) {
    videoName = new URLSearchParams(search).get('videoName');
    url = new URL(`${API_ROOT}/api/playback`);

    url.searchParams.append('videoPath', videoPaths[videoName]);
  }

  return (
    <React.Fragment>
      <h1>{videoName}</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load video" />}
      {videoPaths && (
        <video id="video-player" controls preload="metadata">
          <source src={url.toString()} type="video/mp4" />
        </video>
      )}
    </React.Fragment>
  );
};
