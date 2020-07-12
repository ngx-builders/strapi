import { Tree } from '@angular-devkit/schematics';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { join } from 'path';

describe('app', () => {
  let appTree: Tree;
  const runner = new SchematicTestRunner(
    '@ngx-builders/strapi',
    join(__dirname, '../../../collection.json')
  );
  beforeEach(() => {
    appTree = Tree.empty();
    appTree = createEmptyWorkspace(appTree);
  });

  it('should generate files', async () => {
    const tree = await runner.runSchematic('app', { name: 'myStarpiApp' }, appTree);
    console.log(tree.files);
    expect(tree.readContent('apps/my-strapi-app/main.ts')).toContain(
      `import strapi from 'strapi'`
    );
  });

});
