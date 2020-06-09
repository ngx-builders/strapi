import { chain, noop, Rule } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addPackageWithInit,
  formatFiles,
  setDefaultCollection,
  updateJsonInTree,
} from '@nrwl/workspace';
import { Schema } from './schema';

export const updateDependencies = addDepsToPackageJson(
  {
    'knex': '0.21.1',
    'koa': '2.11.0',
    'module-alias': '2.2.2',
    'sqlite3': 'latest',
    'strapi': '3.0.0-beta.20.1',
    'strapi-admin': '3.0.0-beta.20.1',
    'strapi-connector-bookshelf': '3.0.0-beta.20.1',
    'strapi-plugin-content-manager': '3.0.0-beta.20.1',
    'strapi-plugin-content-type-builder': '3.0.0-beta.20.1',
    'strapi-plugin-email': '3.0.0-beta.20.1',
    'strapi-plugin-upload': '3.0.0-rc.0',
    'strapi-plugin-users-permissions': '3.0.0-beta.20.1',
    'strapi-utils': '3.0.0-beta.20.1'
  }, {}
);

function moveDependency(): Rule {
  return updateJsonInTree('package.json', (json) => {
    json.dependencies = json.dependencies || {};

    delete json.dependencies['@nrwl/nest'];
    return json;
  });
}

export default function (schema: Schema) {
  return chain([
    setDefaultCollection('@nrwl/strapi'),
    schema.unitTestRunner === 'jest'
      ? addPackageWithInit('@nrwl/jest')
      : noop(),
    updateDependencies,
    moveDependency(),
    formatFiles(schema),
  ]);
}
