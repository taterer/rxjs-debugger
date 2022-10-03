import { Observable } from "rxjs"
import { dragElement } from './draggable'

const subscriptionsMap: Map<string, { tracePath: string, count: number, stacktrace: string }> = new Map();
let subscriptionsDeltaMap: Map<string, { tracePath: string, count: number }> = new Map();

let renderTimer

function render (element) {
  clearTimeout(renderTimer)
  renderTimer = setTimeout(() => actualRender(element), 5)
}

function actualRender (element) {
  element.replaceChildren(<div>
    <div
      style={`
        margin: 0px 10px;
        display: flex;
        align-items: center;
      `}>
      <div style='padding: 0px 10px 0px 10px; width: 60px; text-align: center;'>Current</div>
      <div style='padding: 0px 10px 0px 10px; width: 60px; text-align: center; cursor: pointer;' onclick={() => {
        const deltaMap = new Map()
        subscriptionsMap.forEach(subscription => {
          deltaMap.set(subscription.tracePath, { tracePath: subscription.tracePath, count: subscription.count })
        })
        subscriptionsDeltaMap = deltaMap
        render(element)
      }}>Delta</div>
      <div style='flex-grow: 1; width: 0px;'>Trace</div>
    </div>
    {Array.from(subscriptionsMap.values())
      .sort((a, b) => {
        if (a.count === b.count) {
          if (b.stacktrace > a.stacktrace) {
            return -1
          } else {
            return 1
          }
        } else {
          return b.count - a.count
        }
      })
      .map((subscription) => {
        const delta = subscription.count - (subscriptionsDeltaMap.get(subscription.tracePath)?.count || 0)
        return (
          <div
            onclick={() => { console.log(`TRACE ${subscription.tracePath.split(' -> ').slice(0, subscription.tracePath.split(' -> ').length - 1 || 1).join(' -> ')} 
            ${subscription.stacktrace}`) }}
            style={`
              cursor: pointer;
              margin: 10px;
              display: flex;
              align-items: center;
            `}
          >
            <div style='padding: 10px; width: 60px; text-align: center;'>{subscription.count}</div>
            <div style={`padding: 10px; width: 60px; text-align: center; background-color: ${delta > 0 ? '#ff8080' : delta < 0 ? '#ffff80' : '#90ee90'};`}>{delta}</div>
            <div style='flex-grow: 1; width: 0px;'>{subscription.tracePath}</div>
          </div>
        )
      })
    }
  </div>)
}

const getTracePath = (stacktrace) => {
  return stacktrace
  .split('\n')
  .map(i => i.trim().split(' '))
  .filter(i => i.length > 1)
  .map(i => i[1])
  .filter(i => i !== 'TRACING')
  .filter(i => i !== 'Observable.overrideSubscribe')
  .filter(i => i !== 'doInnerSub')
  .filter(i => i !== 'outerNext')
  .filter(i => i !== 'OperatorSubscriber._this._next')
  .filter(i => i !== 'Subscriber.next._next')
  .filter(i => i !== 'Subscriber.next')
  .filter(i => i !== 'Observable._subscribe')
  .filter(i => i !== 'Observable.subscribe')
  .filter(i => i !== 'Observable._trySubscribe')
  .filter(i => i !== 'newRequire')
  .join(' -> ')
};

export function fullAnalysis () {
  const element = <div />
  const container = <div style={`
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
  `}>
    <div style={`
      display: flex;
      justify-content: space-between;
      background-color: #ff00aa;
      padding: 20px;
      margin-bottom: 15px;
    `}>
      <div style={`
        font-size: 1.2em;
        font-weight: 700;
      `}>
        RxJS Debugger
      </div>
    </div>
    {element}
  </div>

  document.body.appendChild(container)
  dragElement(container);

  (function (originalSubscribe) {
    Observable.prototype.subscribe = function overrideSubscribe () {
      const subscription = originalSubscribe.call(this, ...arguments)

      const stacktrace = new Error('TRACING').stack!;
      if ((stacktrace.match(/.overrideSubscribe/g) || []).length === 1) { // Thank you Filipe Mendes for the help ignoring nested subscriptions https://github.com/filipemendes1994/rxjs-debugger
        const tracePath = getTracePath(stacktrace);

        const existingRecord = subscriptionsMap.get(tracePath) || { count: 0 }
        subscriptionsMap.set(tracePath, {
          tracePath,
          count: existingRecord.count + 1,
          stacktrace
        })
        
        render(element)
  
        // register a callback for when the subscription is completed
        subscription.add(() => {
          const unsubRecord = subscriptionsMap.get(tracePath) || { tracePath: getTracePath(stacktrace), count: 1, stacktrace }
          const newCount = unsubRecord.count - 1
          if (newCount) {
            subscriptionsMap.set(tracePath, { tracePath: unsubRecord.tracePath, count: newCount, stacktrace: unsubRecord.stacktrace })
          } else {
            subscriptionsMap.delete(tracePath)
          }
          render(element)
        })
      }
      return subscription
    }
  })(Observable.prototype.subscribe)
}
