import {
  checkFilesExist,
  ensureNxProject,
  readJson,
  runNxCommandAsync,
  uniq,
} from '@nrwl/nx-plugin/testing';
describe('strapi e2e', () => {
  it('should create strapi', async (done) => {
    const plugin = uniq('strapi');
    ensureNxProject('@ngx-builders/strapi', 'dist/packages/strapi');
    await runNxCommandAsync(`generate @ngx-builders/strapi:strapi ${plugin}`);

    const result = await runNxCommandAsync(`build ${plugin}`);
    expect(result.stdout).toContain('Executor ran');

    done();
  });

  describe('--directory', () => {
    it('should create src in the specified directory', async (done) => {
      const plugin = uniq('strapi');
      ensureNxProject('@ngx-builders/strapi', 'dist/packages/strapi');
      await runNxCommandAsync(
        `generate @ngx-builders/strapi:strapi ${plugin} --directory subdir`
      );
      expect(() =>
        checkFilesExist(`apps/subdir/${plugin}/src/config/database.js`)
      ).not.toThrow();
      done();
    });
  });

  // describe('--tags', () => {
  //   it('should add tags to nx.json', async (done) => {
  //     const plugin = uniq('strapi');
  //     ensureNxProject('@ngx-builders/strapi', 'dist/packages/strapi');
  //     await runNxCommandAsync(
  //       `generate @ngx-builders/strapi:strapi ${plugin} --tags e2etag,e2ePackage`
  //     );
  //     const nxJson = readJson('nx.json');
  //     expect(nxJson.projects[plugin].tags).toEqual(['e2etag', 'e2ePackage']);
  //     done();
  //   });
  // });

});
