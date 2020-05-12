import React from 'react';
import { IFetchStatus } from 'src/hooks/useFetch';
import { INameRelativeMap } from 'src/api/videos';

export const VideosContext = React.createContext<
  IFetchStatus<INameRelativeMap>
>({
  status: 'settled'
});
