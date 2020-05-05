import React from 'react';
import styles from './ErrorText.scss';

interface IProps {
  msg: string;
}

export const ErrorText: React.FC<IProps> = ({ msg }) => (
  <div className={styles.error}>{msg}</div>
);
