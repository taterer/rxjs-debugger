![npm (scoped)](https://img.shields.io/npm/v/@taterer/rxjs-debugger?label=NPM) ![NPM](https://img.shields.io/npm/l/@taterer/rxjs-debugger?label=License) ![npm](https://img.shields.io/npm/dt/@taterer/rxjs-debugger?label=Downloads)

# RxJS-Debugger
A graphical user interface to visualize RxJS pipes in the browser.

![](https://github.com/jtmckay/tater-taste/blob/HEAD/client/public/tater.svg)
### Why?
It can be difficult to ensure RxJS subscriptions are properly disposed of, or that events are firing as expected in relation to other pipes.
### How it works
On import, an element will be appended automatically to the browser document body with a high z-index. There are two methods of debugging: fullAnalysis, and tag. Full will track all subscriptions automatically. Tag will monitor the subscriptions and emissions through the pipe.

# Install
`yarn add -D @taterer/rxjs-debugger`

or

`npm i --save-dev @taterer/rxjs-debugger`
# Use
Call fullAnalysis at the beginning of your code to track all subscriptions in your application. Click on the "Delta" column header to zero-out the delta, and track changes from there. EG: zero-out, navigate to a new page, come back and verify the delta is 0. Click on subscriptions in the UI to get a stack trace in the console to track down exactly where the subscriptions are coming from.
```
import { fullAnalysis } from "@taterer/rxjs-debugger";
fullAnalysis()
```

![](https://github.com/taterer/rxjs-debugger/blob/HEAD/src/public/rxjs-debugger-fullAnalysis.png)

Call tag in any RxJS pipeline in your code to visualize subscriptions and emissions in the browser. Anytime a "tag" in a pipe is subscribed to, it will show a track in the debugger. Events through the pipe will appear as icons that scroll across the page for 10 seconds. Events are also logged in the console. When a subscription is completed, or unsubscribed it will be displayed in the debugger, and logged; the track will disappear after 5 seconds.
```
import { tag } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  tag('Example')
)
.subscribe();
```

![](https://github.com/taterer/rxjs-debugger/blob/HEAD/src/public/rxjs-debugger-screenshot.png)

The slow operator can be helpful in interpreting the flow
```
import { slow, tag } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  slow(),
  tag('Example')
)
.subscribe();
```
Equivalent to
```
import { concatMap, timer, map } from 'rxjs';
import { tag } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  concatMap(i => timer(1000).pipe(map(() => i))),
  tag('Example')
)
.subscribe();
```

## Customization
RxJS Debugger uses material icons, and provides an enum with some of the options for easy reference. You can also specify a color to more easily track events in the console.
```
import { tag, Icon } from "@taterer/rxjs-debugger";

const subscription = observable
.pipe(
  tag({ name: 'Example', color: 'gold', icon: Icon.hotel })
)
.subscribe();
```
