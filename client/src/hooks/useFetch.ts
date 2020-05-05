import { useState, useEffect } from 'react';

type TStatus = 'pending' | 'settled';

export interface IFetchStatus<T> {
  status: TStatus;
  payload?: T;
  error?: Error;
}

export function useFetch<T>(
  url: string,
  options?: RequestInit
): IFetchStatus<T> {
  const [payload, setPayload] = useState<T>();
  const [error, setError] = useState();
  const [status, setStatus] = useState<TStatus>('settled');

  async function performFetch(): Promise<T> {
    let response;

    try {
      response = await fetch(url, options);
    } catch (error) {
      throw error;
    }

    return await response.json();
  }

  useEffect(() => {
    setStatus('pending');

    performFetch()
      .then(setPayload)
      .catch(setError)
      .then(() => setStatus('settled'));
  }, [url]);

  return { status, payload, error };
}
