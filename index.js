#! /usr/bin/env node
const path = require('path');
const camelCase = require('camelcase');
const requireEsm = require('esm')(module);
const findUp = require('find-up');
const tasks = process.argv.slice(2);

findUp('tasks.js').then(function(tasksFile) {

    process.chdir(path.dirname(tasksFile));

    const moduleA = requireEsm(tasksFile);
    
    if (tasks.length > 0) {
        return tasks.reduce(function(p, task) {
            return p.then(function(data) {
                return moduleA[camelCase(task)].call(moduleA, data);
            });
        }, Promise.resolve());
    } else {
        return moduleA.default.call(moduleA);
    }

}).catch(console.error);
