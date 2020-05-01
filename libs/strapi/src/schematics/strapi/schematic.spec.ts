import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import { createEmptyWorkspace } from '@nrwl/workspace/testing';
import { join } from 'path';

import { StrapiSchematicSchema } from './schema';

describe('strapi schematic', () => {
  let appTree: Tree;
  const options: StrapiSchematicSchema = { name: 'test' };

  const testRunner = new SchematicTestRunner(
    '@ngx-builders/strapi',
    join(__dirname, '../../../collection.json')
  );

  beforeEach(() => {
    appTree = createEmptyWorkspace(Tree.empty());
  });

  it('should run successfully', async () => {
    await expect(
      testRunner.runSchematicAsync('strapi', options, appTree).toPromise()
    ).resolves.not.toThrowError();
  });
});
