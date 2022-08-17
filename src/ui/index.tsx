import { css, cx } from "@emotion/css";
import { BehaviorSubject, EMPTY } from 'rxjs'
import { concatMap, filter, take, withLatestFrom } from 'rxjs/operators'
import Timeline from "./Timeline";
import Explosion from "./Explosion";
import { subscription$, complete$ } from "../domain/pipe";

const view$ = new BehaviorSubject(<View />)

function View () {
  return (
    <div id='mydivheader' class={css`
        width: 100%;
        max-width: 800px;
        background-color: white;
        border-radius: 4px;
        transition: box-shadow .25s, -webkit-box-shadow .25s;
        position: fixed;
        bottom: 25px;
        left: 25px;
        padding: 0px;
        overflow: auto;
        height: fit-content;
        max-height: 800px;
        margin: 0px;
        z-index: 2000000;
      `
    }>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <div class={css`
        font-size: 1.2em;
        font-weight: 700;
        background-color: #ff00aa;
        padding: 20px;
        margin-bottom: 15px;
      `}>
        RxJS Debugger
      </div>
    </div>
  )
}

view$
.pipe(
  take(1)
)
.subscribe(view => {
  const parent = <div id='mydiv' />
  parent.appendChild(view)
  document.body.appendChild(parent)
  dragElement(view)
})

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const headerElement = document.getElementById(elmnt.id + "header")
  if (headerElement) {
    // if present, the header is where you move the DIV from:
    headerElement.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

subscription$
.pipe(
  concatMap(async i => i),
  withLatestFrom(view$),
)
.subscribe(([subscription, view]) => {
  const timeline = <div
    class={css`
      padding: 10px 20px;
    `}>
    <Timeline destruction$={EMPTY} subscriptionId={subscription.id} tag={subscription.tag} />
  </div>
  view.appendChild(timeline)
  complete$
  .pipe(
    filter(i => i.id === subscription.id),
    take(1),
  )
  .subscribe(() => {
    timeline.appendChild(<div class={css`
      margin: -1.2em;
      position: absolute;
    `}>
      <Explosion destruction$={EMPTY} icon='flare' color='red' particles={15} />
    </div>)
    setTimeout(() => {
      timeline.remove()
    }, 5000)
  })
})
