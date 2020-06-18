#!/usr/bin/env node

'use strict';

var commander = require('commander');
var API = require('./API');
var pkg = require('./package.json');
var transformer = require('./treeTransformer');

var ENABLE = true;

commander.version(pkg.version)
    .option('-i, --ignore <items>', 'floder/files to be ignored', (val) => {
        return val.split(',')
    })
    .option('-a, --auto', 'auto create Node.js project tree, ignore node_modules/* add color schemes')
    .option('-c, --color', 'add color schemes')
    .option('-s, --save', 'create a .md file ./tree2.md')
    .usage('[options] <dir>');

commander.on('--help', function () {
    console.log('  Basic Examples:');
    console.log('');
    console.log(' Start :');
    console.log(' $tree2 ');

    console.log(' Auto Node.js tree2 :');
    console.log(' $tree2 -a');
    console.log('');
    console.log(' Show others dir :');
    console.log(' $tree2 /usr/local');
    console.log('');
    console.log(' Ignore [nodele_module,bin ...] floder');
    console.log(' $tree2 -i node-module, bin');
    console.log('');

});

commander.command('update')
    .description('update tree2')
    .action(function () {
        ENABLE = false;
        API.update();
    });

commander.parse(process.argv);

let opt = {};
console.log('commander', commander);
opt.transformer = transformer
opt.dir = commander.args[0] || process.cwd();
opt.ignore = commander.ignore || [];
opt.color = commander.color;
opt.save = commander.save;
if (commander.auto) {
    opt.ignore.push('node_modules');
    opt.color = true
}

if (ENABLE) {
    API.result(opt);
}