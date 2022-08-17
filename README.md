![npm (scoped)](https://img.shields.io/npm/v/@taterer/rxjs-debugger?label=NPM) ![NPM](https://img.shields.io/npm/l/@taterer/rxjs-debugger?label=License) ![npm](https://img.shields.io/npm/dt/@taterer/rxjs-debugger?label=Downloads)

# RxJS-Debugger
A graphical user interface to visualize RxJS pipes in the browser.

![](https://github.com/jtmckay/tater-taste/blob/HEAD/client/public/tater.svg)
# Install
#### `yarn add -D @taterer/rxjs-debugger`
#### or
#### `npm i --save-dev @taterer/rxjs-debugger`
# Use
Call tag in any RxJS pipeline in your code to visualize it in the browser.
```
import { tag } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  tag({ name: 'Example', color: 'gold', icon: 'star' })
)
.subscribe();
```
![](https://github.com/taterer/rxjs-debugger/blob/HEAD/src/public/rxjs-debugger-screenshot.png)

## Icons
RxJS Debugger uses material icons, and provides an enum with some of the options for easy reference. 
```
import { tag, Icon } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  tag({ name: 'Example', color: 'gold', icon: Icon.hotel })
)
.subscribe();
```
