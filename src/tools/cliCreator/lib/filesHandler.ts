import fse from 'fs-extra';
import { prompt } from 'inquirer';
import { loading } from '@root/src/utils/global';

/**
 * 覆盖目录
 * @param targetDirectory
 * @param options
 */
export const clearDirectory = async (targetDirectory: string, options: Record<string, unknown>): Promise<string> => {
  try {
    if (options.force) {
      // 强制删除
      await fse.removeSync(targetDirectory);
      return Promise.resolve('Done');
    }

    // 非强制覆盖，执行询问操作
    const { isOverwrite } = await prompt([
      {
        name: 'isOverwrite',
        type: 'list',
        message: '目录已存在，是否覆盖',
        choices: [
          { name: '覆盖', value: true },
          { name: '取消', value: false },
        ],
      },
    ]);

    // 取消
    if (!isOverwrite) return Promise.resolve('Cancel');

    // 覆盖
    await loading(`删除中...`, fse.removeSync, targetDirectory);
    return Promise.resolve('Done');
  } catch (err) {
    return Promise.reject('清除目录失败');
  }
};
