import { join } from 'path';
import camelCase from 'camelcase';
import { pathToFileURL } from 'url';
const [ , , file, ...tasks ] = process.argv;

(async () => {
    const moduleA = await import(pathToFileURL(join(process.cwd(), file)));
    if (tasks.length > 0) {
        await tasks.reduce(async (data, task) => {
            return await moduleA[camelCase(task)].call(moduleA, data);
        }, void 0);
    } else {
        await moduleA.default.call(moduleA);
    }
})().catch(console.error);
