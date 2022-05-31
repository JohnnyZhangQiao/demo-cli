import { prompt } from 'inquirer';
import shell from 'shelljs';
import fse from 'fs-extra';
import fs from 'fs';
import { cyan, red } from 'chalk';
import { loading } from '@root/src/utils/global';
import { template, TTemplate } from '../constants/repo';

type TInfo = {
  repo: string;
  name: string;
  version: string;
  author: string;
  description: string;
};

/**
 * 创建项目主线程
 */
export const mainLine = async (projectName: string) => {
  try {
    const info: TInfo = {
      repo: '',
      name: projectName,
      version: '',
      author: '',
      description: '',
    };

    // 仓库信息 —— 模板信息
    info.repo = await getRepoInfo();

    // 标签信息 —— 版本信息
    info.version = await getTagInfo(info.repo);

    // 作者
    info.author = await getAuthor();

    // 描述
    info.description = await getDescription();

    // 下载模板
    await loading(`Cloning into ${info.repo}`, download, info);

    console.log(`\r\nSuccessfully created project ${cyan(info.name)}`);
  } catch (err) {
    console.log(red('❌ Error: ' + err));
  }
};

/**
 * 选取模板
 */
const getRepoInfo = async () => {
  try {
    // 获取组织下的仓库信息
    const repoList = await loading<TTemplate[]>(
      'waiting for fetching template',
      () => template,
    );

    if (!repoList || repoList.length === 0) return Promise.reject('无权限访问');

    // 提取仓库名
    const repos = repoList.map((item) => item.name);

    // 选取模板信息
    const { repo } = await prompt([
      {
        name: 'repo',
        type: 'list',
        message: 'Please choose a template to create project',
        choices: repos,
      },
    ]);
    return repo;
  } catch (err) {
    return Promise.reject('获取仓库模板出错');
  }
};

/**
 * 选取版本
 * @param repo
 */
const getTagInfo = async (repo: string): Promise<string> => {
  try {
    const tagList = await loading<string[]>(
      'waiting for fetching version',
      getTagInfoList,
      repo,
    );

    if (!tagList || tagList.length === 0) return Promise.reject('无版本列表');

    // 选取模板信息
    const { tag } = await prompt([
      {
        name: 'tag',
        type: 'list',
        message: 'Please choose a version to create project',
        choices: tagList,
      },
    ]);
    return tag;
  } catch (err) {
    return Promise.reject('获取版本出错');
  }
};

/**
 * 输入作者
 */
const getAuthor = async () => {
  try {
    const { stdout } = await shell.exec('git config user.name', {
      silent: true,
    });

    const { author } = await prompt([
      {
        name: 'author',
        type: 'input',
        message: 'Please enter your name',
        default: stdout.replace(/\n/g, ''),
      },
    ]);
    return author;
  } catch (err) {}
};

/**
 * 输入项目描述
 */
const getDescription = async () => {
  try {
    const { description } = await prompt([
      {
        name: 'description',
        type: 'input',
        message: 'Please enter project description',
        default: 'a paas project',
      },
    ]);
    return description;
  } catch (err) {}
};

/**
 * 获取模板版本
 * @param repo
 */
const getTagInfoList = (repo: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    shell.exec(
      `git ls-remote --tag ${template.find((item) => item.name === repo)?.git}`,
      { silent: true },
      (code, stdout, stderr) => {
        if (code === 0) {
          const tags: string[] = [];
          stdout
            .split('\n')
            .filter((item) => !!item)
            .forEach((item) => {
              const tagStr = item.match(/[^\/]+(?!.*\/)/);
              if (tagStr && tagStr.length > 0) tags.push(tagStr[0]);
            });
          resolve(tags);
        } else {
          reject(stderr);
        }
      },
    );
  });
};

/**
 * 下载模板
 * @param info
 */
const download = async (info: TInfo) => {
  try {
    const gitUrl = template.find((item) => item.name === info.repo)?.git;

    if (!gitUrl) return Promise.reject('git repository is not found');

    const { code, stderr } = await shell.exec(
      `git clone --branch ${info.version} ${gitUrl}`,
      { silent: true },
    );

    if (code === 0) {
      const cwd = process.cwd();

      // 重命名
      await fs.renameSync(`${cwd}/${info.repo}`, `${cwd}/${info.name}`);

      // 删除.git目录
      await fse.remove(`${cwd}/${info.name}/.git`);

      // 删除package-lock
      await fse.remove(`${cwd}/${info.name}/package-lock.json`);

      // package.json修改
      let pkg = await fse.readJSONSync(`${cwd}/${info.name}/package.json`);
      pkg = { ...pkg, ...info };
      await fse.writeJSONSync(`${cwd}/${info.name}/package.json`, pkg);

      return Promise.resolve('success');
    } else return Promise.reject(stderr);
  } catch (err) {
    return Promise.reject('下载模板出错');
  }
};
