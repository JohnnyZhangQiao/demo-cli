import axios from 'axios';

// 拦截全局请求响应
axios.interceptors.response.use(res => {
  return res.data;
});

/**
 * 获取模板
 * @returns Promise
 */
export const getRepo = async (): Promise<any> => {
  return axios.get('xxx');
};

/**
 * 获取仓库下的版本
 * @param {string} repo 模板名称
 * @returns Promise
 */
export const getTagsByRepo = async (repo: string): Promise<any> => {
  return axios.get(`xxx`);
};
