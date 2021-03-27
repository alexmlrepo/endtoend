import { NightwatchBrowser } from 'nightwatch';

module.exports = {
  'Design of homepage'(browser: NightwatchBrowser) {
    return browser
      .login()
      .compareScreenshot('design-of-homepage.png', 6)
      .end();
  },

  beforeEach(browser: NightwatchBrowser) {
    return browser.windowSize('current', 1000, 1000);
  },
};
