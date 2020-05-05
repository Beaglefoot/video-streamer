declare namespace ErrorTextScssModule {
  export interface IErrorTextScss {
    error: string;
  }
}

declare const ErrorTextScssModule: ErrorTextScssModule.IErrorTextScss & {
  /** WARNING: Only available when `css-loader` is used without `style-loader` or `mini-css-extract-plugin` */
  locals: ErrorTextScssModule.IErrorTextScss;
};

export = ErrorTextScssModule;
