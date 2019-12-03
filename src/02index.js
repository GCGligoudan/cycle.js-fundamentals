import xs from 'xstream';
import { run } from '@cycle/run';
import { h, div, label, input, hr, h1, makeDOMDriver } from '@cycle/dom';

function main(sources) {
  const inputEv$ = sources.DOM.select('.field').events('input');
  const values$ = inputEv$.map((e) => e.target.value).startWith('');
  const sinks = {
    DOM: values$.map((value) => 
      div([
        label('Name: '),
        input('.field', { type: 'text'}),
        hr(),
        h1([
          `hello ${value}!`
        ])
      ])
    )
  }
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app'),
})