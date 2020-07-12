import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { readJsonInTree } from '@nrwl/workspace';
import { join } from 'path';


describe('init', () => {
  let tree: Tree;
  const runner = new SchematicTestRunner(
    '@ngx-builders/strapi',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    tree = Tree.empty();
    tree = createEmptyWorkspace(tree);
  });

  it('should add dependencies', async () => {
    const result = await runner.runSchematic('init', {}, tree);
    const packageJson = readJsonInTree(result, 'package.json');

    expect(packageJson.dependencies['@nrwl/strapi']).toBeUndefined();
    expect(packageJson.devDependencies['strapi']).toBeDefined();
   });

  describe('defaultCollection', () => {
    it('should be set if none was set before', async () => {
      const result = await runner.runSchematic('init', {}, tree);
      const workspaceJson = readJsonInTree(result, 'workspace.json');
      expect(workspaceJson.cli.defaultCollection).toEqual('@nrwl/strapi');
    });
  });

  it('should not add jest config if unitTestRunner is none', async () => {
    const result = await runner.runSchematic(
      'init',
      {
        unitTestRunner: 'none',
      },
      tree
    );
    expect(result.exists('jest.config.js')).toEqual(false);
  });
});
