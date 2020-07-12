import { join, normalize, } from '@angular-devkit/core';
import {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
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
      builder: '@nrwl/strapi:build',
      options: {
        outputPath: `${options.projectRoot}/public`,
        uglify: true,
        color: true,
        profile: false,
      },
      configurations: {
        production: {},
      },
    };

    architect.serve = {
      builder: '@nrwl/strapi:server',
      options: {
        buildTarget: `${options.projectName}:build`,
      },
      configurations: {
        production: {
          buildTarget: `${options.projectName}:build:production`,
        },
      },
    };

    architect.lint = generateProjectLint(
      normalize(options.projectRoot),
      join(normalize(options.projectRoot), 'tsconfig.json'),
      Linter.EsLint
    );

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
    formatFiles(),
  ]);
};


