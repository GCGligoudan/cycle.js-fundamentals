import xs from 'xstream';
import { run } from '@cycle/run';
import { makeHTTPDriver } from '@cycle/http';
import { div, button, h1, h4, a, makeDOMDriver } from '@cycle/dom';

function main(sources) {
  const clickEvent$ = sources.DOM.select('.first').events('click');
  const request$ = clickEvent$.map(() => {
    return {
      url: 'http://jsonplaceholder.typicode.com/users/1',
      category: 'user',
    }
  });
  const response$ = sources.HTTP.select('user').flatten();
  const firstUser$ = response$.map((respond) => respond.body).startWith({});

  const sinks = {
    DOM: firstUser$.map((firstUser) => 
      div([
        button('.first', 'Get first User'),
        firstUser?div('.user-details',[
          h1('.user-name', firstUser.name),
          h4('.user-email', firstUser.email),
          a('.user-website', { attrs: { href: firstUser.website }}, firstUser.website)
        ]):null
      ])
    ),
    HTTP: request$,
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver,
})