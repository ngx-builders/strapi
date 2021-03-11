import { chain, noop, Rule } from '@angular-devkit/schematics';
import { addDependenciesToPackageJson, installPackagesTask, Tree } from '@nrwl/devkit';
import { addPackageWithInit, formatFiles } from '@nrwl/workspace';
import { Schema } from './schema';

const addDependencies = (host: Tree) => {
  return addDependenciesToPackageJson(host, {
    "strapi": "3.5.1",
    "strapi-admin": "3.5.1",
    "strapi-utils": "3.5.1",
    "strapi-plugin-content-type-builder": "3.5.1",
    "strapi-plugin-content-manager": "3.5.1",
    "strapi-plugin-users-permissions": "3.5.1",
    "strapi-plugin-email": "3.5.1",
    "strapi-plugin-upload": "3.5.1",
    "strapi-connector-bookshelf": "3.5.1",
    "knex": "<0.20.0",
    "sqlite3": "5.0.0"
  }, {
    "cross-env": "^7.0.3",
    "grunt": "^1.3.0",
    "grunt-cleanempty": "1.0.4",
    "grunt-contrib-clean": "2.0.0",
    "grunt-contrib-copy": "1.0.0",
    "grunt-exec": "3.0.0",
    "load-grunt-configs": "^1.0.0",
    "module-alias": "^2.2.2",
    "tsconfig-paths": "^3.9.0",
    "ttypescript": "^1.5.12",
    "typescript-transform-paths": "^2.2.3"
  });
}

const updateGitIgnore = (host: Tree) => {
  const content: Buffer | null = host.read(".gitignore");
  let strContent: string = '';
  if (content) strContent = content.toString();
  const updatedContent = `${strContent}\n**/.cache/\n**/build/`;
  host.write(".gitignore", updatedContent);
  return noop();
}

export default async function (host: Tree, schema: Schema) {
  schema.unitTestRunner === 'jest'
    ? addPackageWithInit('@nrwl/jest')
    : noop();
  addDependencies(host);
  updateGitIgnore(host);
  return () => {
    installPackagesTask(host);
  };
}
