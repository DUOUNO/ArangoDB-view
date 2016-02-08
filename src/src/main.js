/***
 * (c) 2016 by duo.uno
 *
 ***/
 
let requireJsConfig = {
  waitSeconds: 0,
  shim: {
    'angular': {
      deps: ['jquery']  // ! load angular bevor jquery to get not the jquery.event in the ng-mouse events    
    },
    'angular-route': {
      deps: ['angular']
    },
    'angular-animate': {
       deps: ['angular']
    },
    'bootstrap': {
      deps: ['jquery']
    },
    'ngjsoneditor': {
      deps: ['jsoneditor', 'angular']
    }
  },

  paths: {}
}

let requireJsPaths = {
  'bootstrap'      : 'lib/bootstrap-4-0-0',
  'jquery'         : 'lib/jquery-2-2-0',
  'angular'        : 'lib/angular-1-4-9',
  'angular-route'  : 'lib/angular-route-1-4-9',
  'angular-animate': 'lib/angular-animate-1-4-9',
  'jsoneditor'     : 'lib/jsoneditor-5-1-3',
  'ngjsoneditor'   : 'lib/ngjsoneditor-1-0-0'
}

for(var path in requireJsPaths) {
  requireJsConfig.paths[path] = requireJsPaths[path];
}

requirejs.config(requireJsConfig);

requirejs(['jquery', 'angular',  'app', 'ngjsoneditor',
  'home/homeController',
  'navBar/navBarController',
  'collectionsBar/collectionsBarController',
  'collection/collectionController',
  'document/documentController',
  'document/documentRouteController',

  'services/messageBrokerService',
  'services/queryService',
  'services/formatService',
  'services/testService'], ($) => {
  $.ajaxSetup({cache:false});

  angular.bootstrap(document, ['app']);

});
