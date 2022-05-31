import path from 'path';
import fse from 'fs-extra';
import { clearDirectory } from './filesHandler';
import { mainLine } from './creator';
import { red } from 'chalk';

export const create = async (
  projectName: string,
  options: Record<string, unknown>,
) => {
  try {
    // 获取当前工作目录
    const cwd = process.cwd();
    const targetDirectory = path.join(cwd, projectName);
    let result = '';

    // 检查是否有文件覆盖
    if (fse.existsSync(targetDirectory)) {
      result = await clearDirectory(targetDirectory, options);
    }

    if (result === 'Cancel') return;

    // 创建项目总线
    await mainLine(projectName);
  } catch (err) {
    console.log(red('❌ Error: ' + err));
  }
};
