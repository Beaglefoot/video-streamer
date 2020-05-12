declare namespace PlayVideoScssModule {
  export interface IPlayVideoScss {
    container: string;
  }
}

declare const PlayVideoScssModule: PlayVideoScssModule.IPlayVideoScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: PlayVideoScssModule.IPlayVideoScss;
};

export = PlayVideoScssModule;
