import { JsonObject } from '@angular-devkit/core';
import { chain, noop, Rule } from '@angular-devkit/schematics';
import {
  addDepsToPackageJson,
  addPackageWithInit,
  formatFiles,
  setDefaultCollection,
  updateWorkspace,
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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function jsonIdentity(x: any): JsonObject {
  return x as JsonObject;
}

function setDefault(): Rule {
  const updateProjectWorkspace = updateWorkspace((workspace) => {
    workspace.extensions.schematics =
      jsonIdentity(workspace.extensions.schematics) || {};

    const strapiSchematics =
      jsonIdentity(workspace.extensions.schematics['@nrwl/strapi']) || {};

    workspace.extensions.schematics = {
      ...workspace.extensions.schematics,
      '@nrwl/strapi': {
        application: {
          ...jsonIdentity(strapiSchematics.application),
        },
      },
    };
  });
  return chain([setDefaultCollection('@nrwl/gatsby'), updateProjectWorkspace]);
}

export default function (schema: Schema) {
  return chain([
    setDefault(),
    schema.unitTestRunner === 'jest'
      ? addPackageWithInit('@nrwl/jest')
      : noop(),
    updateDependencies,
    formatFiles(schema),
  ]);
}
