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

    route.when('/database/:currentDatabase/collection/:currentCollection/:from/:to', {
      controller: 'collectionController',
      templateUrl: 'collection/collectionView.html'
    });

    route.when('/database/:currentDatabase/collection/:currentCollection/:from/:to/:index/document/:documentKey', {
      controller: 'documentController',
      templateUrl: 'document/documentView.html'
      // resolve: {'formatService':'formatService'}
    });

    // route.when('/collection/:collectionName/:from/:to/:index', {
    //   controller: 'documentRouteController',
    //   template:''
    // });


    // H O M E
    route.when('/database/:currentDatabase', {
      controller:  'homeController',
      templateUrl: 'home/homeView.html'
    });
    
    route.otherwise({redirectTo: '/database/_system'});
}]);

app.run(['$rootScope', '$location', 'messageBrokerService', '$routeParams', '$route', (rootScope, location, messageBroker, routeParams, route) => {
  messageBroker.pub('current.database', '_system');
  messageBroker.pub('current.fastFilter', 'none');
  messageBroker.pub('show.fastFilter', false);
  rootScope.$on('$routeChangeError', (a, b, c, d) => {
    console.log('routeChangeError');
  });


  /*      route.current.params
          | routeParams
      rcs 0 0
      lcs 0 0
      lcs 1 0
      rcs 1 1
  */
  rootScope.$on('$routeChangeStart', () => {
    console.log('routeChangeStart');
    // if(route.current) console.log(JSON.stringify(route.current.params, false, 2));
    // console.log(JSON.stringify(routeParams,false, 2));
  });

  rootScope.$on('$locationChangeStart', (e, newUrl, oldUrl) => {
    console.log('locationChangeStart', oldUrl, newUrl);
    // if(route.current) console.log(JSON.stringify(route.current.params, false, 2));
    // console.log(JSON.stringify(routeParams,false, 2));
  });

  rootScope.$on('$locationChangeSuccess', () => {
    console.log('locationChangeSuccess');
    // if(route.current) console.log(JSON.stringify(route.current.params, false, 2));
    // console.log(JSON.stringify(routeParams,false, 2));

    if(route.current) {
      if(route.current.params.currentDatabase)   messageBroker.pub('current.database',   route.current.params.currentDatabase);
      if(route.current.params.currentCollection) messageBroker.pub('current.collection', route.current.params.currentCollection);
    } // if
  });

  rootScope.$on('$routeChangeSuccess', () => {
    console.log('routeChangeSuccess');
    // if(route.current) console.log(JSON.stringify(route.current.params, false, 2));
    // console.log(JSON.stringify(routeParams,false, 2));
  });
}]);

export default app;
