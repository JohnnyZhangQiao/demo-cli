import axios from 'axios';

// 拦截全局请求响应
axios.interceptors.response.use((res) => {
  return res.data;
});

/**
 * 获取模板
 * @returns Promise
 */
export const getRepo = async (): Promise<any> => {
  return axios.get(
    'https://git.woa.com/api/v3/projects?private_token=CSiY7Iw-mxsDWwuGbpiQ&&search=templates',
  );
};

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise
 */
export const getTagsByRepo = async (repo: string): Promise<any> => {
  return axios.get(
    `https://git.woa.com/api/v3/projects/${repo}/repository/tags?private_token=CSiY7Iw-mxsDWwuGbpiQ`,
  );
};
