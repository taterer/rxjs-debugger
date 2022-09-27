import '@taterer/rx-jsx'
import { css } from "@emotion/css";
import { BehaviorSubject, EMPTY, of, Subject } from 'rxjs'
import { concatMap, delay, filter, map, scan, take, takeUntil } from 'rxjs/operators'
import Timeline from "./Timeline";
import Explosion from "./Explosion";
import { subscription$, complete$ } from "../domain/pipe";
import { withAnimationFrame } from '@taterer/rx-jsx';

function View () {
  const count$ = new BehaviorSubject(0)

  const activeSubscriptions$ = count$
  .pipe(
    withAnimationFrame,
    scan((accumulator, current) => accumulator + current),
    map(count => <div>{count ? count : 'No'} active subscriptions</div>),
  )
  
  const subscriptions$ = subscription$
  .pipe(
    concatMap(async i => i),
    map(subscription => {
      count$.next(1)
      const destroy$ = new Subject()
      const explosion$ = complete$
      .pipe(
        filter(i => i.id === subscription.id),
        takeUntil(destroy$),
        map(() => {
          count$.next(-1)
          return (
            <div class={css`
              margin: -1.2em;
              margin-top: -3em;
              position: absolute;
            `}>
              <Explosion destruction$={EMPTY} icon='flare' color='red' particles={15} />
            </div>
          )
        })
      )
  
      explosion$
      .pipe(
        take(1),
        delay(5000)
      )
      .subscribe(() => destroy$.next(undefined))
      
      return <div
        class={css`
          padding: 10px 20px;
        `}
        single$={explosion$}
      >
        <Timeline
          destruction$={EMPTY}
          subscriptionId={subscription.id}
          tag={subscription.tag}
          />
      </div>
    })
  )
  
  const view$ = of(
    <div id='rxjs-debugger' class={css`
        width: 100%;
        max-width: 800px;
        background-color: #fffffff2;
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
        touch-action: none;
        cursor: grab;
      `
    }>
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"></link>
      <div class={css`
        display: flex;
        justify-content: space-between;
        background-color: #ff00aa;
        padding: 20px;
        margin-bottom: 15px;
      `}>
        <div class={css`
          font-size: 1.2em;
          font-weight: 700;
        `}>
          RxJS Debugger
        </div>
        <div single$={activeSubscriptions$} />
      </div>
      <div multi$={subscriptions$} />
    </div>
  )

  view$
  .pipe(
    take(1)
  )
  .subscribe(view => dragElement(view))

  return (
    <div single$={view$} />
  )
}

document.body.appendChild(<View />)

function dragElement(element) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  element.onmousedown = dragMouseDown;
  element.ontouchstart = event => dragMouseDown(event.touches[0], false);

  function dragMouseDown(event, preventDefault = true) {
    event = event || window.event;
    if (preventDefault) {
      event.preventDefault();
    }
    // get the mouse cursor position at startup:
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    document.ontouchmove = e => {
      e.preventDefault()
      elementDrag(e.touches[0], false)
    };
  }

  function elementDrag(event, preventDefault = true) {
    event = event || window.event;
    if (preventDefault) {
      event.preventDefault();
    }
    // calculate the new cursor position:
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}
