import {
  animationFrameScheduler,
  fromEvent,
  Observable,
  OperatorFunction,
  pluck,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  withLatestFrom
} from 'rxjs';

export type HTMLDestroyElement = HTMLElement & { destroy: Function }

// Critical JSX replacement

(window as any).createElement = (tag, props, ...children) => {
  if (typeof tag === 'function') return tag(props, ...children);
  const element = document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]: [string, any]) => {
    if (name.startsWith('on') && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2), value);
    }
    else if (name === 'element$') {
      value.next(element)
    } else if (name === 'destroy$') {
      value
      .pipe(
        takeUntil(value)
      )
      .subscribe({
        complete: () => element.remove()
      })
      element.destroy = () => value.next(undefined)
    } else {
      element.setAttribute(name, value.toString());
    }
  });

  children.forEach(child => {
    appendChild(element, child);
  });

  return element;
};

const appendChild = (parent, child) => {
  if (Array.isArray(child))
    child.forEach(nestedChild => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

// Helper functions

export function toElement$ (destruction$: Observable<any>): [Subject<Element>, ((next: any) => void)] {
  const element$ = new Subject<Element>()
  const elementQueue$ = new Subject<Element>()

  elementQueue$
  .pipe(
    withLatestFrom(element$),
    takeUntil(destruction$)
  )
  .subscribe(([toBe, current]) => {
    current.replaceWith(toBe)
    element$.next(toBe)
  })

  return [element$, i => elementQueue$.next(i)]
}

export const withAnimationFrame: OperatorFunction<any, any> = switchMap(async (value) => {
  return await new Promise(resolve => {
    animationFrameScheduler.schedule(() => {
      resolve(value)
    })
  })
})

export function fromEventElement$ (target$: Observable<Element>, eventName: string): Observable<Event> {
  return target$
  .pipe(
    switchMap(target => fromEvent(target, eventName))
  )
}

export function fromValueElementKeyup$(target$: Subject<Element>, defaultValue?: string): Observable<string> {
  return target$
  .pipe(
    switchMap<Element, Observable<string>>(target => fromEvent<any>(target, 'keyup').pipe(pluck('target', 'value'))),
    startWith(defaultValue || ''),
  )
}

export function classSync (target: Element, classToSync: string, shouldHaveClass: boolean): void {
  if (shouldHaveClass) {
    target.classList.add(classToSync)
  } else {
    target.classList.remove(classToSync)
  }
}
