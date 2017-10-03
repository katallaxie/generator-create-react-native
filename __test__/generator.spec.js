import helpers from 'yeoman-test';
import path from 'path';

beforeEach(() => {
  jest.resetModules();
  // The object returned act like a promise, so return it to wait until the process is done
});

describe('run generator', () => {
  test('generation', async () => {
    try {
      await helpers.run(path.join(__dirname, '../app'))
        .withArguments([])
        .withPrompts({
          "appName": "test",
          "install": true
        });
    } catch (object) {
      expect(object.error).toEqual('');
    }
  });
})

