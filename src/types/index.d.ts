import * as NW from 'nightwatch';

// merge interfaces with nightwatch types
declare module 'nightwatch' {
  export interface NightwatchCustomAssertions {
    screenshotEquals(
      this: NW.NightwatchBrowser,
      filename: string,
      tolerance?: number,
      callback?: Function,
    ): NW.NightwatchBrowser;

    urlMatch(this: NW.NightwatchBrowser, regex: RegExp, msg?: string): NW.NightwatchBrowser;
  }

  export interface LoginOptions {
    user?: string;
    pass?: string;
  }

  export interface LogoutOptions {}

  export interface NightwatchCustomCommands {
    login(this: NW.NightwatchBrowser, options?: LoginOptions): NW.NightwatchBrowser;

    logout(this: NW.NightwatchBrowser, options?: LogoutOptions): NW.NightwatchBrowser;

    compareScreenshot(
      this: NW.NightwatchBrowser,
      filename: string,
      tolerance?: number,
      callback?: Function,
    ): NW.NightwatchBrowser;
  }
}
