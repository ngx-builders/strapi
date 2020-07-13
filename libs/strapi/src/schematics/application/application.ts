import { join, normalize, } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  externalSchematic,
  mergeWith,
  move,
  noop,
  Rule,
  url,
} from '@angular-devkit/schematics';
import {
  addProjectToNxJsonInTree,
  formatFiles,
  generateProjectLint,
  Linter,
  names,
  projectRootDir,
  ProjectType,
  toFileName,
  updateWorkspaceInTree,
} from '@nrwl/workspace';
import { updateJestConfigContent } from '@nrwl/react/src/utils/jest-utils';
import { StrapiSchematicSchema as Schema } from './schema';


import init from '../init/init';


const projectType = ProjectType.Application;

interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}


function addAppFiles(options: NormalizedSchema): Rule {
  return mergeWith(
    apply(url(`./files`), [
      applyTemplates({
        ...options,
        ...names(options.name),
      }),
      move(options.projectRoot),
    ])
  );
}


function addProject(options: NormalizedSchema): Rule {
  return updateWorkspaceInTree((json) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const architect: { [key: string]: any } = {};

    architect.build = {
      builder: '@nrwl/workspace:run-commands',
      options: {
        commands: [
          {
            command: `cd ${options.projectRoot}/src && yarn`
          },
          {
            command: `cd ${options.projectRoot}/src && NODE_OPTIONS=\"-r ./strapi-typescript/register\" NODE_ENV=\"production\" node main build`
          },
          {
            command: "yarn global add grunt-cli"
          },
          {
            command: `grunt --gruntfile=${options.projectRoot}/Gruntfile.js build`
          }
        ],
        parallel: false
      }
    };

    architect.develop = {
      builder: "@nrwl/workspace:run-commands",
      options: {
        commands: [
          {
            command: "yarn"
          },
          {
            command: "NODE_OPTIONS=\"-r ./strapi-typescript/register\" yarn develop"
          }
        ],
        cwd: `${options.projectRoot}/src`,
        parallel: false
      }
    };

    architect.serve = {
      builder: '@nrwl/workspace:run-commands',
      options: {
        commands: [
          {
            command: "yarn"
          },
          {
            command: "NODE_OPTIONS=\"-r ./strapi-typescript/register\" yarn start"
          }
        ],
        cwd: `${options.projectRoot}/src`,
        parallel: false
      }
    };

    architect.lint = generateProjectLint(
      normalize(options.projectRoot),
      join(normalize(options.projectRoot), 'tsconfig.app.json', 'tsconfig.spec.json'),
      Linter.EsLint
    );

    architect.test = {
      builder: "@nrwl/jest:jest",
      options: {
        jestConfig: `${options.projectRoot}/jest.config.js`,
        tsConfig: `${options.projectRoot}/tsconfig.spec.json`,
        passWithNoTests: true
      }
    };

    json.projects[options.projectName] = {
      root: options.projectRoot,
      sourceRoot: `${options.projectRoot}/src`,
      projectType,
      schematics: {},
      architect,
    };

    json.defaultProject = json.defaultProject || options.projectName;

    return json;
  });
}

function normalizeOptions(
  options: Schema
): NormalizedSchema {
  const name = toFileName(options.name);
  const projectDirectory = options.directory
    ? `${toFileName(options.directory)}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${projectRootDir(projectType)}/${projectDirectory}`;
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

function addJest(options: NormalizedSchema): Rule {
  return options.unitTestRunner === 'jest'
    ? externalSchematic('@nrwl/jest', 'jest-project', {
        project: options.projectName,
        supportTsx: true,
        skipSerializers: true,
        setupFile: 'none',
        babelJest: false,
      })
    : noop();
}

function updateJestConfig(options: NormalizedSchema) {
  return options.unitTestRunner === 'none'
    ? noop()
    : (host) => {
        const appProjectRoot = `${options.projectRoot}`;
        const configPath = `${appProjectRoot}/jest.config.js`;
        const originalContent = host.read(configPath).toString();
        const content = updateJestConfigContent(originalContent);
        host.overwrite(configPath, content);
      };
}

export default function (options: NormalizedSchema): Rule {
  const normalizedOptions = normalizeOptions(options);
  //  const options = normalizeOptions(host, schema);
  return chain([
    init({
      ...options,
      skipFormat: true,
    }),
    addProject(normalizedOptions),
    addProjectToNxJsonInTree(normalizedOptions.projectName, {
      tags: normalizedOptions.parsedTags,
    }),
    // addLintFiles(options.appProjectRoot, options.linter),
    addAppFiles(normalizedOptions),
    addJest(normalizedOptions),
    updateJestConfig(normalizedOptions),
    formatFiles(),
  ]);
};


