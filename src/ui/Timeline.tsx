import { css } from "@emotion/css"
import { merge, Observable } from "rxjs"
import { map, takeUntil, share, concatMap, filter } from "rxjs/operators"
import { Icon } from "../domain/timeline/command"
import Explosion from "./Explosion"
import { emission$, Tag } from "../domain/pipe"

const animationTransform = [
  { transform: 'translateX(120px)' },
  { transform: 'translateX(740px)' }
]

const animationTiming = {
  duration: 10000,
  iterations: 1
}

export default function Timeline ({
  destruction$,
  subscriptionId,
  tag,
}: {
  destruction$: Observable<any>,
  subscriptionId: string,
  tag: Tag,
}) {
  const timelineEvent$ = emission$
  .pipe(
    filter(i => i.subscriptionId === subscriptionId),
    concatMap(async i => i),
    map(() => <i style={`position: absolute; color: ${tag.color || 'black'}`} class="material-icons dp48">{tag.icon || Icon.message}</i>),
    takeUntil(destruction$),
  )

  const explosion$ = emission$
  .pipe(
    filter(i => i.subscriptionId === subscriptionId && i.tag.icon === 'star'),
    concatMap(async i => i),
    map(() => <Explosion destruction$={destruction$} icon='star' color='gold' particles={10} />),
    takeUntil(destruction$),
  )

  const timelineEvents$ = merge(explosion$, timelineEvent$).pipe(share())

  timelineEvents$
  .subscribe(element => {
    setTimeout(() => {
      element.remove()
    }, animationTiming.duration -1)

    element.animate(animationTransform, animationTiming)
  })

  return <div multi$={timelineEvents$}
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
