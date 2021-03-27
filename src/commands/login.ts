import { NightwatchBrowser, LoginOptions } from 'nightwatch';

export function command(this: NightwatchBrowser, options: LoginOptions = {}) {
  const url = this.globals.root_url;
  const path = this.globals.login_path;
  return this.url(`${url}/${path}`)
    .pause(2000)
    .waitForElementVisible('#usr', 10000)
    .setValue('#usr', options.user || this.globals.user)
    .setValue('#pwd', options.pass || this.globals.pass)
    .click('input[type=submit]')
    .pause(1000)
    .waitForElementVisible('body')
    .pause(1000);
}
