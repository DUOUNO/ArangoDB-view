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

let angularVersion = '1-5-0';
let requireJsPaths = {
  'bootstrap'      : 'lib/bootstrap-4-0-0',
  'jquery'         : 'lib/jquery-2-2-0',
  'angular'        : `lib/angular-${angularVersion}`,
  'angular-route'  : `lib/angular-route-${angularVersion}`,
  'angular-animate': `lib/angular-animate-${angularVersion}`,
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

  'manage/collectionsController',

  'services/messageBrokerService',
  'services/queryService',
  'services/formatService',
  'services/fastFilterService',
  'services/testService',

  'directives/feedbackDirective',
  'directives/journalSizeDirective' ], ($) => {
  $.ajaxSetup({cache:false});

  angular.bootstrap(document, ['app']);

});
