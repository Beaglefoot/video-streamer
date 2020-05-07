import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { VideosList } from 'src/components/VideosList/VideosList';
import { PlayVideo } from 'src/components/PlayVideo/PlayVideo';
import { fetchVideos, INameRelativeMap } from 'src/api/videos';
import { IFetchStatus } from 'src/hooks/useFetch';

export const VideosContext = React.createContext<
  IFetchStatus<INameRelativeMap>
>({
  status: 'settled'
});

export const App: React.FC = () => {
  return (
    <VideosContext.Provider value={fetchVideos()}>
      <BrowserRouter>
        <Switch>
          <Route path="/play" component={PlayVideo} />
          <Route component={VideosList} />
        </Switch>
      </BrowserRouter>
    </VideosContext.Provider>
  );
};
