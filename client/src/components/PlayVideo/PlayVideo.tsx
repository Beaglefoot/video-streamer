import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { VideosContext } from '../App/App';
import { ErrorText } from '../ErrorText/ErrorText';

export const PlayVideo: React.FC = () => {
  const { video } = useParams();
  const { payload: videoPaths, status, error } = useContext(VideosContext);
  const url = new URL(`${API_ROOT}/api/playback`);

  url.searchParams.append('videoPath', videoPaths[video]);

  return (
    <React.Fragment>
      <h1>{video}</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load video" />}
      {videoPaths && (
        <video id="video-player" controls>
          <source src={url.toString()} type="video/mp4" />
        </video>
      )}
    </React.Fragment>
  );
};
