import { from, scan, takeUntil } from "rxjs"

const animationTiming = {
  duration: 5000,
  iterations: Infinity
}

export default function ({ destruction$, color, icon, particles }) {
  const particleDeg = 360 / particles
  const explosion$ = from(new Array(particles).fill(0).map(() => <i style={`position: absolute; color: ${color};`} class="material-icons dp48">{icon}</i>))

  explosion$
  .pipe(
    scan((acc, current) => {
      return [current, acc[1] + 1]
    }, [undefined, -1]),
    takeUntil(destruction$)
  )
  .subscribe(([element, index]) => {
    element.animate(
      [
        { transform: `rotate(${index * particleDeg}deg) translate(0px)` },
        { transform: `rotate(${index * particleDeg + 90}deg) translate(0, -50px)` },
        { transform: `rotate(${index * particleDeg + 180}deg) translate(0, -50px)` },
        { transform: `rotate(360deg) translate(0px)` },
        { transform: `rotate(360deg) translate(0px)scale(2)` },
        { transform: `rotate(360deg) translate(0px)scale(1)` },
        { transform: `rotate(360deg) translate(0px)scale(2)` },
        { transform: `rotate(360deg) translate(0px)scale(1)` },
      ],
      animationTiming
    )
  })

  return <div multi$={explosion$} style='position: relative;' />
}
