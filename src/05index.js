import xs from 'xstream';
import {run} from '@cycle/run';
import {div, input, makeDOMDriver} from '@cycle/dom';

function main(sources) {
  const changeValue$ = sources.DOM.select('.slider').events('input')
    .map(e => e.target.value);
  const DEFAULT_VALUE = 50;
  const state$ = changeValue$.startWith(DEFAULT_VALUE);
  const vdom$ = state$.map(state=>
      div([
        'Label:'+state+'units',
        input('.slider', {
          attrs: { type: 'range', min: 0, max: 100, state}
        })
      ])
    )
  return {
    DOM: vdom$,
  }
}

run(main, {
  DOM: makeDOMDriver('#app'),
})