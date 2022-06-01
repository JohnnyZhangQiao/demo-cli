import ora from 'ora';

/**
 * loading加载效果
 * @param {string} message 加载信息
 * @param {(...args: any[]) => any} fn 加载函数
 * @param {any} args fn 函数执行的参数
 * @returns 异步调用返回值
 */
export const loading = async <T>(message: string, fn: (...args: any[]) => any, ...args: any[]): Promise<T | undefined | void | null> => {
  const spinner = ora(message);
  spinner.start(); // 开启加载
  try {
    const executeRes = await fn(...args);
    spinner.succeed();
    return Promise.resolve(executeRes);
  } catch (err: any) {
    spinner.fail(err);
    return Promise.reject(err);
  }
};
