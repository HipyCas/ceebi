import {
  addProjectConfiguration,
  readProjectConfiguration,
  updateProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  logger,
  readRootPackageJson,
  writeJsonFile,
} from '@nx/devkit';
import * as path from 'path';
import { InitCapGeneratorSchema } from './schema';

export async function initiCapGenerator(
  tree: Tree,
  schema: InitCapGeneratorSchema
) {
  const projectConfig = readProjectConfiguration(tree, schema.project);
  if (projectConfig.projectType !== 'application') {
    logger.error('Project needs to be an app');
    return;
  }
  const projectRoot = `apps/${schema.project}`;
  const pkgJSON = readRootPackageJson();
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    ...schema,
  });
  writeJsonFile(
    path.join(projectRoot, 'capacitor-plugins.json'),
    Object.keys(pkgJSON.dependencies).filter((pkg) => pkg.includes('capacitor'))
  );
  logger.warn('Revise capacitor-plugins.json and remove not needed ones');
  await formatFiles(tree);
}

export default initiCapGenerator;
