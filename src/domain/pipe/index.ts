import { pipe, tap, finalize, Operator, Subscription, Subscriber, Subject } from 'rxjs'
import { v4 as uuid } from 'uuid'

export interface Tag {
  name: string
  skipTap?: boolean
  icon?: string
  color?: string
}

type Subscription = {
  id: string
  tag: Tag
}

export const subscription$: Subject<Subscription> = new Subject<Subscription>()
export const unsubscription$: Subject<{ id: string }> = new Subject<{ id: string }>()

type Emission = { subscriptionId: string, tag: Tag, message: any }

export const emission$: Subject<Emission> = new Subject<Emission>()

/**
 * Keep track of subscriptions and emissions through an RxJS pipeline
 * @param tag Tag a pipeline
 * @param tag.name Name the pipeline
 * @param tag.color Color the pipeline
 * @param tag.icon Icon to track the pipeline
 * @param tag.skipTap Skip logging to console
 * @returns RxJS OperatorFunction
 */
export function tag (tag: Tag) {
  const subscriptionId = uuid()
  const tagged = pipe(
    (source) => {
      return source.lift(new TagOperator(tag, subscriptionId))
    },
    tap(i => emission$.next({ subscriptionId, tag, message: i })),
    finalize(() => unsubscription$.next({ id: subscriptionId }))
  )
  if (tag.skipTap) {
    return tagged
  }
  const pipeline = pipe(
    tagged,
    tap(i => console.log(
      `%cTag%c "${tag.name}": ${JSON.stringify(i)}`,
      `background: ${tag.color}`,
      `background: white`
    )),
  )

  return pipeline
}

class TagOperator<T> implements Operator<T, T> {
  readonly tag: Tag;
  readonly subscriptionId: string;
  constructor(tag: Tag, subscriptionId: string) {
    this.tag = tag;
    this.subscriptionId = subscriptionId;
  }
  call(subscriber: Subscriber<T>, source: any): any {
    const subscription = source.subscribe(subscriber);
    subscription$.next({ id: this.subscriptionId, tag: this.tag })
    return subscription
  }
}


// const original = Observable.prototype.subscribe

// Observable.prototype.subscribe = function (...args): Subscription {
//     console.log('SUBBED')
//     const subscription = original.call(this, ...args)
//     subscription.test = 'some-identifier'
//     subscription$.next(subscription)
//     return subscription
// }
