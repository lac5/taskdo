#! /usr/bin/env node
const { join, dirname } = require('path');
const camelCase = require('camelcase');
const requireEsm = require('esm')(module);
let [ , , file, ...tasks ] = process.argv;

file = join(process.cwd(), file);

process.chdir(dirname(file));

const moduleA = requireEsm(file);

if (tasks.length > 0) {
    tasks.reduce(async (p, task) => {
        return p.then(data => moduleA[camelCase(task)].call(moduleA, data));
    }, Promise.resolve()).catch(console.error);
} else {
    Promise.resolve(moduleA.default.call(moduleA)).catch(console.error);
}
