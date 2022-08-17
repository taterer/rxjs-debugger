![npm (scoped)](https://img.shields.io/npm/v/@taterer/rxjs-debugger?label=NPM) ![NPM](https://img.shields.io/npm/l/@taterer/rxjs-debugger?label=License) ![npm](https://img.shields.io/npm/dt/@taterer/rxjs-debugger?label=Downloads)

# RxJS-Debugger
A graphical user interface to visualize RxJS pipes in the browser.

![](https://github.com/jtmckay/tater-taste/blob/HEAD/client/public/tater.svg)
### Why?
It can be difficult to ensure RxJS subscriptions are properly disposed of, or that events are firing as expected in relation to other pipes.
### How it works
On import, an element will be appended automatically to the browser document body with a high z-index. Anytime a "tag" in a pipe is subscribed to, it will show a track in the debugger. Events through the pipe will appear as icons that scroll across the page for 10 seconds. Events are also logged in the console. When a subscription is completed, or unsubscribed it will be displayed in the debugger, and logged; the track will disappear after 5 seconds.

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
