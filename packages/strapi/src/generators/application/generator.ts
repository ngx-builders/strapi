import { join, normalize } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,

  mergeWith,
  move, Rule, url
} from '@angular-devkit/schematics';
import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree
} from '@nrwl/devkit';
import { generateProjectLint, Linter, ProjectType, updateWorkspaceInTree } from '@nrwl/workspace';
import * as path from 'path';
import { StrapiGeneratorSchema } from './schema';

interface NormalizedSchema extends StrapiGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

const projectType = ProjectType.Application;

function normalizeOptions(
  host: Tree,
  options: StrapiGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(host).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(host: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    host,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

function addProject(host: Tree, normalizedOptions: NormalizedSchema) {
  addProjectConfiguration(host, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'application',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: [
            {
              command: `cd ${normalizedOptions.projectRoot}/src && yarn`
            },
            {
              command: `cd ${normalizedOptions.projectRoot}/src && npx cross-env NODE_OPTIONS=\"-r ./strapi-typescript/register\" NODE_ENV=\"production\" node main build`
            },
            {
              command: "yarn global add grunt-cli"
            },
            {
              command: `grunt --gruntfile=${normalizedOptions.projectRoot}/Gruntfile.js build`
            }
          ],
          parallel: false
        },
      },
      develop:{
        executor: "@nrwl/workspace:run-commands",
        options: {
          commands: [
            {
              command: "yarn"
            },
            {
              command: "npx cross-env NODE_OPTIONS=\"-r ./strapi-typescript/register\" node main develop"
            }
          ],
          cwd: `${normalizedOptions.projectRoot}/src`,
          parallel: false
        }
      },
      start:{
        executor: '@nrwl/workspace:run-commands',
        options: {
          commands: [
            {
              command: "yarn"
            },
            {
              command: "npx cross-env NODE_OPTIONS=\"-r ./strapi-typescript/register\" node main start"
            }
          ],
          cwd: `${normalizedOptions.projectRoot}/src`,
          parallel: false
        }
      },
      test: {
        executor: "@nrwl/jest:jest",
        options: {
          jestConfig: `${normalizedOptions.projectRoot}/jest.config.js`,
          tsConfig: `${normalizedOptions.projectRoot}/tsconfig.spec.json`,
          passWithNoTests: true
        }
      },
      lint: {
        executor: "@nrwl/linter:eslint",
        options: {
          lintFilePatterns: [
            `${normalizedOptions.projectRoot}/**/*.ts`
          ]
        }
      },

    },
    tags: normalizedOptions.parsedTags,
  });

}

export default async function (host: Tree, options: StrapiGeneratorSchema) {
  const normalizedOptions = normalizeOptions(host, options);
  addProject(host, normalizedOptions),
  addFiles(host, normalizedOptions);
  //addAppFiles(normalizedOptions),
  await formatFiles(host);
}
