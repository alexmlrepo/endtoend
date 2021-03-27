import * as resemble from 'node-resemble-js';
import * as mkdirp from 'mkdirp';
import { existsSync, writeFileSync, readFileSync, createWriteStream } from 'fs';
import { dirname, resolve } from 'path';

function getPath(dir: string, file: string) {
  return `screenshots/${dir}/${file}`;
}

export function assertion(filename: string, tolerance?: number, cb?: Function) {
  const baselinePath = getPath('baseline', filename);
  const resultPath = getPath('results/', filename);
  const diffPath = getPath('diffs/', filename);

  this.message = 'Unexpected compareScreenshot error.';
  this.expected = tolerance || 0; // misMatchPercentage tolerance default 0%
  this.screenshots = [resolve(resultPath), resolve(diffPath)];

  this.command = function(callback) {
    mkdirp(dirname(baselinePath), err => {
      //create folder if not exist

      if (err) {
        console.error(err);
      }

      // create new baseline photo if none exists
      if (!existsSync(baselinePath)) {
        console.warn('WARNING: Baseline Photo does NOT exist.');
        console.log(`Creating Baseline Photo from Result: ${baselinePath}`);
        writeFileSync(baselinePath, readFileSync(resultPath));
      }

      resemble(baselinePath)
        .compareTo(resultPath)
        .ignoreAntialiasing()
        .onComplete(callback); // calls this.value with the result
    });

    return this;
  };

  this.value = function(result) {
    //save difference if any
    if (+result.misMatchPercentage !== 0) {
      mkdirp(dirname(diffPath), err => {
        if (err) {
          console.error(err);
        } else {
          result
            .getDiffImage()
            .pack()
            .pipe(createWriteStream(diffPath));
        }
      });
    }
    return +result.misMatchPercentage;
  };

  this.pass = function(value) {
    const pass = value <= this.expected;

    if (pass) {
      this.message = `Screenshots matched for ${filename} with a tolerance of ${this.expected}%.`;
    } else {
      this.message = `Screenshots match failed for ${filename} with a tolerance of ${this.expected}'%.
  Screenshots at:
    Baseline: ${baselinePath}
    Result: ${resultPath}
    Diff: ${diffPath}
  Open ${diffPath} to see how the screenshot has changed.
  If the result screenshot is correct you can use it to update the baseline screenshot and re-run your test:
    cp ${resultPath} ${baselinePath}
  `;
    }

    if (typeof cb === 'function') {
      cb(this.screenshots);
    }

    return pass;
  };
}
