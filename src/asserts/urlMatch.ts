import { format } from 'util';

export function assertion(regex: RegExp, msg?: string) {
  this.message = msg || format('Testing if the URL match the regex "%s".', regex);
  this.expected = regex;

  this.pass = function(value) {
    return this.expected.test(value);
  };

  this.value = result => result.value;

  this.command = function(callback) {
    return this.api.url(callback);
  };

  return this;
}
