import xs from 'xstream';
import { run } from '@cycle/run';
import { button, div, p, label, makeDOMDriver } from '@cycle/dom';

function main(sources) {
  const decrement$ = sources.DOM.select('.decrement').events('click');
  const increment$ = sources.DOM.select('.increment').events('click');

  const decrementAction$ = decrement$.map(() => -1);
  const incrementAction$ = increment$.map(() => +1);

  const numbers$ = xs.merge(decrementAction$, incrementAction$).fold((prev, curr) => prev + curr, 0); 
  const sinks = {
    DOM: numbers$.map((number) => 
      div([
        button('.decrement', 'decrement'),
        button('.increment', 'increment'),
        p([
          label(number)
        ])
      ])
    )
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app'),
})