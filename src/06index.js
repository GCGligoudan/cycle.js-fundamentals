import xs from 'xstream';
import run from '@cycle/run';
import { div, span, input, makeDOMDriver } from '@cycle/dom';

const LabeledSlider = (sources) => {
  const props$ = sources.props;
  const domSource = sources.DOM;

  const inputRange$ = domSource.select('.slider').events('input')
    .map(e => e.target.value);

  const state$ = props$.map(props => inputRange$.map(value => ({
    label: props.label,
    unit: props.unit,
    max: props.max,
    min: props.min,
    value: value,
  })).startWith(props)).flatten().remember();
  
  const vdom$ = state$.map((state) => 
    div('.labeled-slider', [
      span('.labeled', 'label: ' + state.value),
      input('.slider', {
        attrs: { type: 'range', max: state.max, min: state.min, value: state.value }
      })
    ])
  )

  const sinks = {
    DOM: vdom$,
    value: state$.map((state) => state.value)
  };
  return sinks
}

const main = (sources) => {
  const props = xs.of({
    label: 'radius',
    unit: '',
    max: 100,
    min: 10,
    value: 50
  })

  const childSources = {DOM: sources.DOM, props: props};
  const labeledSlider = LabeledSlider(childSources);

  const childVDom$ = labeledSlider.DOM;
  const childValue$ = labeledSlider.value;

  const vdom$ = xs.combine(childValue$, childVDom$).map(([value, childVDom]) =>
    div([
      childVDom,
      div({
        style: {
          backgroundColor: 'pink',
          borderRadius: '50%',
          width: String(value * 2) + 'px',
          height: String(value * 2) + 'px',
        }
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