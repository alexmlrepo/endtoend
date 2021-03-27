import { NightwatchBrowser, LogoutOptions } from 'nightwatch';

export function command(this: NightwatchBrowser, options: LogoutOptions = {}) {
  const url = this.globals.root_url;
  const path = this.globals.logout_path;
  return this.url(`${url}/${path}`)
    .pause(2000)
    .waitForElementVisible('button[type=submit]', 10000)
    .click('button[type=submit]')
    .pause(1000)
    .waitForElementVisible('body')
    .pause(1000);
}
