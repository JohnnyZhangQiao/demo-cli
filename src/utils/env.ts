import production from '../../config/production';
import test from '../../config/test';
import development from '../../config/development';

/**
 * 获取当前环境
 */
export const fetchEnv = (): any => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return development;
    case 'test':
      return test;
    case 'production':
      return production;
    default:
      return development;
  }
};
