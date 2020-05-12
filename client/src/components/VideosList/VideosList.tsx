import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ErrorText } from 'src/components/ErrorText/ErrorText';
import { VideosContext } from 'src/components/App/App';
import { getBasename } from './getBasename';
import { getThumbnailApiUrl } from 'src/api/videos';
import styles from './VideosList.scss';

export const VideosList: React.FC = () => {
  const { payload: videos, status, error } = useContext(VideosContext);

  return (
    <>
      <h1>VideosList</h1>
      {status === 'pending' && <div>Loading...</div>}
      {error && <ErrorText msg="Failed to load videos list" />}
      {videos &&
        Object.keys(videos).map((videoName) => (
          <Link
            to={`/play?videoName=${videoName}`}
            key={videoName}
            className={styles.link}
          >
            {getBasename(videoName)}
            <img
              src={getThumbnailApiUrl(
                videos[videoName].thumbnailPath
              ).toString()}
            />
          </Link>
        ))}
    </>
  );
};
