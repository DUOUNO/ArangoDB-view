/***
 * (c) 2016 by duo.uno
 *
 ***/

import _angular from 'angular'
import angularRoute    from 'angular-route'
import angularAnimate  from 'angular-animate'
import jsoneditor      from 'jsoneditor'
import ngjsoneditor    from 'ngjsoneditor'

window.JSONEditor = jsoneditor;

let app = angular.module('app', ['ngRoute', 'ngAnimate', 'ng.jsoneditor']);

app.config(['$routeProvider', '$locationProvider', '$sceDelegateProvider', (route, locationProvider, sceDelegateProvider) => {

    locationProvider.html5Mode(true)

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

    // route.when('/collection/:collectionName/:from/:to/:index', {
    //   controller: 'documentRouteController',
    //   template:''
    // });


    // H O M E
    route.when('/', {
      controller:  'homeController',
      templateUrl: 'home/homeView.html'
    });
    
    route.otherwise({redirectTo: '/'});
}]);

app.run(['$rootScope', '$location', 'messageBrokerService', (rootScope, location, messageBroker) => {
  messageBroker.pub('current.database', '_system');
  messageBroker.pub('current.fastFilter', 'none');
  messageBroker.pub('show.fastFilter', false);
  rootScope.$on('$routeChangeError', (a, b, c, d) => {
    console.log('routeChangeError');
  });

  rootScope.$on('$locationChangeStart', (e, newUrl, oldUrl) => {
    // console.log('url change', newUrl, oldUrl);
  });
}]);

export default app;
