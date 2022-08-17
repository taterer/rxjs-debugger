import { css } from "@emotion/css"
import { Observable } from "rxjs"
import { takeUntil, withLatestFrom, concatMap, filter } from "rxjs/operators"
import { Icon } from "../domain/timeline/command"
import { toElement$ } from "./jsx"
import Explosion from "./Explosion"
import { emission$, Tag } from "../domain/pipe"

const animationTransform = [
  { transform: 'translateX(120px)' },
  { transform: 'translateX(740px)' }
]

const animationTiming = {
  duration: 5000,
  iterations: 1
}

export default function Timeline ({
  destruction$,
  subscriptionId,
  tag,
  debug = false,
  scroll = true
}: {
  destruction$: Observable<any>,
  subscriptionId: string,
  tag: Tag,
  debug?: boolean,
  scroll?: boolean,
}) {
  const [timeline$] = toElement$(destruction$)

  emission$
  .pipe(
    filter(i => i.subscriptionId === subscriptionId),
    concatMap(async i => i),
    withLatestFrom(timeline$),
    takeUntil(destruction$),
  )
  .subscribe(([emission, timeline]) => {
    const timelineElement = <i style={`position: ${scroll ? 'absolute' : ''}; color: ${tag.color || 'black'}`} class="material-icons dp48">{tag.icon || Icon.message}</i>
    timeline.appendChild(timelineElement)
    if (scroll) {
      setTimeout(() => {
        timelineElement.remove()
      }, animationTiming.duration -1)
  
      timelineElement.animate(animationTransform, animationTiming)
    }

    if (emission.tag.icon === 'star') {
      timelineElement.appendChild(<Explosion destruction$={destruction$} icon='star' color='gold' particles={10} />)
    }

    if (debug) {
      console.log('Timeline element', timelineElement)
    }
  })

  return <div element$={timeline$}
    class={css`
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      position: relative;
      width: 100%;
      height: 40px;
    `}>
      {tag.name}
    </div>
}
