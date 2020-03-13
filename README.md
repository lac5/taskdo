# nodedo
Runs exports from a javascript file as tasks, similar to gulp but simple and fexible.

Install:

```
> npm install -g nodedo
```

or install locally
```
> npm install --save-dev nodedo
```

Example:

`hello.js`
```js
exports.hello = function() {
    console.log('Hello!');
};
```

or ESM style:
```js
export function hello() {
    console.log('Hello!');
}
```

Then run this:
```
> nodedo hello.js hello
Hello!
```

If no arguments are passed, it will try to run the default task.

`hello.js`
```js
exports.default = function() {
    console.log('Hello!');
};
```
OR
```js
export default function() {
    console.log('Hello!');
}
```

```
> nodedo hello.js
Hello!
```

It can also run async function. List multiple tasks in the command-line to run each of them in sequental order.

Example:

`tasks.js`
```js
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const glob = promisify(require('glob'));
const config = require('config');

export async function buildSass() {
    const sassRender = promisify(require('node-sass').render);
    
    await Promise.all((await glob('**/*.scss')).map(async file => {
        let result = await sassRender({ file });
        await fs.writeFile(path.join(config.get('dist'),
            file.substr(0, file.lastIndexOf('.') + '.css')),
            result.css);
    }));
}

export async function buildHbs() {
    const Handlebars = require('promised-handlebars')(require('handlebars'));
    const datauri = require('datauri').promise;
    const data = require('data.json');

    Handlebars.registerHelper('datauri', datauri);

    await Promise.all((await glob('**/*.hbs')).map(async file => {
        let body = String(await fs.readFile(file));
        let template = Handlebars.compile(body);
        let result = await template(data);
        await fs.writeFile(path.join(config.get('dist'),
            file.substr(0, file.lastIndexOf('.') + '.css')),
            result);
    }));
}

export async function webpack() {
    const webpack = promisify(require('webpack'));

    await webpack(require('webpack.config.js'));
}
```

`tasks.js` will be able to run the tasks `build-sass`, `build-hbs`, and `webpack`.

You run each of them in order like this:
```
> nodedo tasks.js build-sass build-hbs webpack
```

NOTE: Each task will run after the previous one finishes. Also, if one fails, the tasks after it won't run.

To run all three function in parallel, make a wrapper function for them:
```js
export async function build() {
    await Promise.all([
        buildSass(),
        buildHbs(),
        webpack(),
    ]);
}
```

Then run:
```
> nodedo tasks.js build
```

You can also call it from `package.json`:
```json
    "scripts": {
        "build": "nodedo tasks.js build",
    }
```

```
> npm run build
```

This way you'll be able to use the locally installed version of `nodedo`.

If you have any questions, shoot me an email! Or post an [issue on GitHub](https://github.com/larryc5/nodedo/issues).
