define(['exports', 'angular', 'angular-route', 'angular-animate', 'jsoneditor', 'ngjsoneditor'], function (exports, _angular2, _angularRoute, _angularAnimate, _jsoneditor, _ngjsoneditor) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _angular3 = _interopRequireDefault(_angular2);

  var _angularRoute2 = _interopRequireDefault(_angularRoute);

  var _angularAnimate2 = _interopRequireDefault(_angularAnimate);

  var _jsoneditor2 = _interopRequireDefault(_jsoneditor);

  var _ngjsoneditor2 = _interopRequireDefault(_ngjsoneditor);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  window.JSONEditor = _jsoneditor2.default;
  var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ng.jsoneditor']);
  app.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', function (route, locationProvider, sceDelegateProvider) {
    locationProvider.html5Mode(true);
    route.when('/manage/collections', {
      controller: 'collectionsController',
      templateUrl: 'manage/collectionsView.html'
    });
    route.when('/database/:currentDatabase/collection/:currentCollection/:from/:to', {
      controller: 'collectionController',
      templateUrl: 'collection/collectionView.html'
    });
    route.when('/database/:currentDatabase/collection/:currentCollection/:from/:to/:index/document/:documentKey', {
      controller: 'documentController',
      templateUrl: 'document/documentView.html'
    });
    route.when('/database/:currentDatabase', {
      controller: 'homeController',
      templateUrl: 'home/homeView.html'
    });
    route.otherwise({
      redirectTo: '/database/_system'
    });
  }]);
  app.run(['$rootScope', '$location', 'messageBrokerService', '$routeParams', '$route', function (rootScope, location, messageBroker, routeParams, route) {
    messageBroker.pub('current.database', '_system');
    messageBroker.pub('current.fastFilter', 'none');
    messageBroker.pub('show.fastFilter', false);
    rootScope.$on('$routeChangeError', function (a, b, c, d) {
      console.log('routeChangeError');
    });
    rootScope.$on('$routeChangeStart', function () {
      console.log('routeChangeStart');
    });
    rootScope.$on('$locationChangeStart', function (e, newUrl, oldUrl) {
      console.log('locationChangeStart', oldUrl, newUrl);
    });
    rootScope.$on('$locationChangeSuccess', function () {
      console.log('locationChangeSuccess');

      if (route.current) {
        if (route.current.params.currentDatabase) messageBroker.pub('current.database', route.current.params.currentDatabase);
        if (route.current.params.currentCollection) messageBroker.pub('current.collection', route.current.params.currentCollection);
      }
    });
    rootScope.$on('$routeChangeSuccess', function () {
      console.log('routeChangeSuccess');
    });
  }]);
  exports.default = app;
});