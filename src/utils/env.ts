import production from '@root/config/production';
import test from '@root/config/test';
import development from '@root/config/development';

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
