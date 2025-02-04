'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const execa = require('execa');


exports.result = function (opt) {
  console.log('\n');
  let treeNodes = createObj(opt.dir, opt, 0)
  opt.transformer && (treeNodes = opt.transformer(treeNodes))
  let res = stru(treeNodes, [], opt).map(line => `${line}  `).join('\n');
  console.log(res);
  opt.save && fs.writeFileSync(path.join(process.cwd(), 'directoryList.md'), res);
  return res;
};


/**
 * 读取到的文件变为数组对象
 * @param dir
 * @param opt
 * @returns {Array}
 */
function createObj(dir, opt, layer) {

  let array = [];
  if (++layer > 10) {
    return array;
  }
  let dirArray = fs.readdirSync(dir).sort(orderedDict);
  for (let file of dirArray) {
    let tempDir = path.join(dir, file);
    if (!/^\./.test(file) && fs.existsSync(tempDir)) {
      let obj = {};
      obj.name = file;
      let stats = fs.statSync(tempDir);
      obj.size = stats.size;
      if (stats.isFile()) {
        obj.type = 'File'
      }
      if (stats.isDirectory()) {
        obj.type = 'Directory'
      }
      if (stats.isBlockDevice()) {
        obj.type = 'BlockDevice'
      }
      if (stats.isCharacterDevice()) {
        obj.type = 'CharacterDevice'
      }
      if (stats.isSymbolicLink()) {
        obj.type = 'SymbolicLink'
      }
      if (stats.isFIFO()) {
        obj.type = 'FIFO'
      }
      if (stats.isSocket()) {
        obj.type = 'Socket'
      }

      if (obj.type == 'Directory' && !opt.ignore.includes(obj.name)) {
        obj.children = createObj(path.join(dir, file), opt, layer)
      }
      array.push(obj);
    }
  }

  return array;
}

/**
 * 数据结构转换为图
 * @param data 数据结构
 * @param pre tree结构前缀
 * @param opt tree 参数
 * @returns {Array}
 */
function stru(data, pre, opt) {
  let array = [];
  if (!data) {
    return array
  }
  data.forEach((node, index) => {
    let last = index == data.length - 1;
    node = colorName(node, opt);
    let line = pre.concat(last ? '└── ' : '├── ', node.name).join('');
    array = array.concat(line);
    let tempPre = pre.concat(last ? '    ' : '│   ');
    array = array.concat(stru(node.children, tempPre, opt));
  });
  return array;
};

/**
 * 排序 以字典排序
 */
function orderedDict(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  if (a > b) {
    return 1
  } else if (a < b) {
    return -1
  } else {
    return 0
  }
}

/**
 * 文件颜色变换
 * @param opt
 */
function colorName(obj, opt) {
  if (!opt.color) {
    return obj
  }
  if (obj.type == 'Directory') {
    obj.name = chalk.blue(obj.name);
  }
  if (path.extname(obj.name) == '.md') {
    obj.name = chalk.red(obj.name);
  }
  if (path.extname(obj.name) == '.json') {
    obj.name = chalk.red(obj.name);
  }
  if (path.extname(obj.name) == '.js') {
    obj.name = path.basename(obj.name, '.js') + chalk.green('.js');
  }
  if (path.extname(obj.name) == '.css') {
    obj.name = path.basename(obj.name, '.css') + chalk.magenta('.css');
  }
  if (path.extname(obj.name) == '.vue') {
    obj.name = path.basename(obj.name, '.vue') + chalk.cyan('.vue');
  }
  if (path.extname(obj.name) == '.html') {
    obj.name = path.basename(obj.name, '.html') + chalk.blue('.html');
  }
  return obj;
}



/**
 * tree3 版本升级
 */
exports.update = function () {
  console.log(chalk.green('[tree3] ') + 'Be sure to have the latest version by doing `npm install tree3@latest -g` before doing this procedure.');
  console.log(chalk.green('[tree3] ') + 'Start update...');
  execa.stdout('npm', ['install', 'tree3', '-g'])
    .then(result => {
      console.log(chalk.green('[tree3] ') + 'Upgrade success!\n' + result)
    })
    .catch(e => {
      console.log(chalk.green('[tree3] ') + 'Upgrade failed\n' + e);
    })
};
