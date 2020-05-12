declare namespace GlobalScssModule {
  export interface IGlobalScss {
    app: string;
  }
}

declare const GlobalScssModule: GlobalScssModule.IGlobalScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: GlobalScssModule.IGlobalScss;
};

export = GlobalScssModule;
