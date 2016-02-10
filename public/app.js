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
    route.when('/collection/:collectionName/:from/:to', {
      controller: 'collectionController',
      templateUrl: 'collection/collectionView.html'
    });
    route.when('/collection/:collectionName/:from/:to/:index/document/:documentKey', {
      controller: 'documentController',
      templateUrl: 'document/documentView.html'
    });
    route.when('/', {
      controller: 'homeController',
      templateUrl: 'home/homeView.html'
    });
    route.otherwise({
      redirectTo: '/'
    });
  }]);
  app.run(['$rootScope', '$location', 'messageBrokerService', function (rootScope, location, messageBroker) {
    messageBroker.pub('current.database', '_system');
    messageBroker.pub('current.fastFilter', 'none');
    messageBroker.pub('show.fastFilter', false);
    rootScope.$on('$routeChangeError', function (a, b, c, d) {
      console.log('routeChangeError');
    });
    rootScope.$on('$locationChangeStart', function (e, newUrl, oldUrl) {});
  }]);
  exports.default = app;
});