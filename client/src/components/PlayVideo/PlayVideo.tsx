import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorText } from '../ErrorText/ErrorText';
import { getPlaybackApiUrl, getThumbnailApiUrl } from 'src/api/videos';
import { VideosContext } from 'src/contexts/VideosContext';
import styles from './PlayVideo.scss';

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
    <div className={styles.container}>
      <h1>{videoName}</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load video" />}
      {videos && (
        <video
          id="video-player"
          controls
          preload="metadata"
          poster={getThumbnailApiUrl(
            videos[videoName].thumbnailPath
          ).toString()}
        >
          <source src={url.toString()} />
        </video>
      )}
    </div>
  );
};
