import xs from 'xstream';
import { h, h1, span, makeDOMDriver } from '@cycle/dom';
import { run } from '@cycle/run';

function main(sources) {
  const mouseover$ = sources.DOM.select('span').events('mouseover');
  const sinks = {
    DOM: mouseover$.startWith(null).map(() => 
      xs.periodic(1000).map(i =>
        h1([
          span([
            `aaaaaa is ${i}`
          ])
        ])  
      )
    ).flatten(),
    log: xs.periodic(1000).map((i) => 2 * i)
  }
  return sinks;
}

function logDriver(msg$) {
  msg$.subscribe({
    next: (i) => {
      console.log(i)
    }
  })
}

run(main, {
  DOM: makeDOMDriver('#app'),
  log: logDriver,
})