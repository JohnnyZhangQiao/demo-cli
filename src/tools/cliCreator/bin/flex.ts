#!/usr/bin/env node
import 'module-alias/register';
import { cyan } from 'chalk';
import { program } from 'commander';
import figlet from 'figlet';
import { create } from '../lib';
import pkg from '@root/package.json';

program
  .command('create <project-name>')
  .description('创建项目')
  .option('-f, --force', '是否强制覆盖')
  .action((projectName, cmd) => {
    create(projectName, cmd).then();
  });

program.on('--help', () => {
  console.log(
    cyan(
      figlet.textSync('dc', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      }),
    ),
  );
});

program.name('dc').usage(`<command> [option]`).version(`dc ${pkg.version}`);
program.parse(process.argv);
