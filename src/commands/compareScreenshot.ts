import { NightwatchBrowser } from 'nightwatch';

export function command(this: NightwatchBrowser, filename: string, tolerance = 0) {
  const screenshotPath = 'screenshots/';
  const resultPath = `${screenshotPath}results/${filename}`;

  return this.saveScreenshot(resultPath, () => {
    this.assert.screenshotEquals(filename, tolerance, screenshots => {
      const { assertions } = this.currentTest.results;
      assertions[assertions.length - 1].screenshots = screenshots;
    });
  });
}
