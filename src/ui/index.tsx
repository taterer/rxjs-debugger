import { css } from "@emotion/css";
import { BehaviorSubject, EMPTY, Observable, of, Subject } from 'rxjs'
import { concatMap, delay, filter, map, scan, take, takeUntil } from 'rxjs/operators'
import Timeline from "./Timeline";
import Explosion from "./Explosion";
import { subscription$, complete$ } from "../domain/pipe";
import { withAnimationFrame } from '@taterer/rx-jsx';
import { dragElement } from './draggable'

function View () {
  const count$ = new BehaviorSubject<number>(0)

  const activeSubscriptions$ = count$
  .pipe(
    withAnimationFrame,
    scan<number, number>((accumulator, current) => accumulator + current),
    map(count => <div>{count ? count : 'No'} active subscriptions</div>),
  )

  const subscriptions$: Observable<HTMLElement> = subscription$
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
      .subscribe(() => {
        count$.next(-1)
        destroy$.next(undefined)
      })
      
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
