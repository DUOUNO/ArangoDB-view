define([], function () {
  'use strict';

  var requireJsConfig = {
    waitSeconds: 0,
    shim: {
      'angular': {
        deps: ['jquery']
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
  };
  var requireJsPaths = {
    'bootstrap': 'lib/bootstrap-4-0-0',
    'jquery': 'lib/jquery-2-2-0',
    'angular': 'lib/angular-1-4-9',
    'angular-route': 'lib/angular-route-1-4-9',
    'angular-animate': 'lib/angular-animate-1-4-9',
    'jsoneditor': 'lib/jsoneditor-5-1-3',
    'ngjsoneditor': 'lib/ngjsoneditor-1-0-0'
  };

  for (var path in requireJsPaths) {
    requireJsConfig.paths[path] = requireJsPaths[path];
  }

  requirejs.config(requireJsConfig);
  requirejs(['jquery', 'angular', 'app', 'ngjsoneditor', 'home/homeController', 'navBar/navBarController', 'collectionsBar/collectionsBarController', 'collection/collectionController', 'document/documentController', 'document/documentRouteController', 'services/messageBrokerService', 'services/queryService', 'services/formatService', 'services/testService'], function ($) {
    $.ajaxSetup({
      cache: false
    });
    angular.bootstrap(document, ['app']);
  });
});