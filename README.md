# Example Nightwatch.js Setup for Azure Pipeline

This repository contains the source code for automatic UI end-to-end tests.

## Installation

Make sure you have Node.js installed on your system. Clone the repository via locally Git. Via the command line execute from the repository's directory:

```sh
npm i
```

All dependencies will be resolved automatically.

## Running Tests

Running the tests can be done as simple as

```sh
npm start
```

This will run `npm run build` and `npm run test` in order. Alternatively, if you transpiled the source files via TypeScript (`tsc`) you can also run the global `nightwatch` CLI.

If you want to run a single test you can do it via

```sh
nightwatch --test dist/tests/changePassword.js --testcase 'Change password does not work if the passwords do not match'
```

Make sure to have the correct spelling of the file / test case. The test case is optional. If you omit it all the test cases in the given module are run. If the module is omitted all test cases are run.

## Development

If you work with VS Code the following plugins are highly recommended:

- Prettier - Code formatter
- EditorConfig for VS Code
- TSLint

For the mail API more information can be found at [guerrillamail.com](https://www.guerrillamail.com/GuerrillaMailAPI.html).
