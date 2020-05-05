import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { VideosContext } from '../App/App';
import { ErrorText } from '../ErrorText/ErrorText';

export const PlayVideo: React.FC = () => {
  const { video } = useParams();
  const { payload: videos, status, error } = useContext(VideosContext);

  return (
    <>
      <div>{video}</div>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load video" />}
      {videos && <div>Path: {videos[video]}</div>}
    </>
  );
};
