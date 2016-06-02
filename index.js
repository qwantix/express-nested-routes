'use strict';

function loadRouteMap( app, map, ctx ) {
  var k, toks, methods, route;
  for( k in  map ) {
    toks = k.split(/\s+/);
    if( toks.length > 1 ) {
      methods = toks.shift( toks ).toLowerCase().split(',');
    }
    route = ctx.route + '/' + toks.join(' ');
    methods = methods || [ ctx.method ];
    methods.forEach( function( method ) {
      if( map[k] instanceof Array ) {
        app[ method ].apply( app, [ route ].concat( map[k] ) );
      }
      else if( typeof map[k] === 'object' ) {
        loadRouteMap( app, map[k], {
          route: route,
          method: method || ctx.method
        });
      }
      else if( typeof map[k] === 'function' ) {
        console.log( 'Register route', method, route );
        app[ method ]( route, map[k] );
      }
    });
  }
}

module.exports = function( app, dir, route ) {
  loadRouteMap( app, typeof dir === 'string' ? require( dir ) : dir, { 
    route: route || '',
    method: 'all'
  } );
};

