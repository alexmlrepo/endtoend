import { NightwatchBrowser } from 'nightwatch';

module.exports = {
  'The login works with the correct credentials'(browser: NightwatchBrowser) {
    return browser
      .login()
      .assert.containsText('#case_login > .success', 'WELCOME')
      .end();
  },

  'The login fails with the incorrect credentials'(browser: NightwatchBrowser) {
    return browser
      .login({ pass: 'foo' })
      .assert.containsText('#case_login > .error', 'DENIED')
      .end();
  },
};
