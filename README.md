# rxjs-debugger
A graphical user interface to visualize RxJS pipes in the browser.

# Install
#### `yarn add -D @taterer/rxjs-debugger`
#### or
#### `npm i --save-dev @taterer/rxjs-debugger`

# Use
Call tag in any RxJS pipeline in your code to visualize it in the browser.
```
const subscription = observable
.pipe(
  tag({ name: 'Example', color: 'gold', icon: 'star' })
)
.subscribe();
```
