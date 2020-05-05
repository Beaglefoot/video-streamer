declare namespace VideosListScssModule {
  export interface IVideosListScss {
    link: string;
  }
}

declare const VideosListScssModule: VideosListScssModule.IVideosListScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: VideosListScssModule.IVideosListScss;
};

export = VideosListScssModule;
