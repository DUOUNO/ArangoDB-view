/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'

let angularModule = ['$scope', '$http', '$interval', 'messageBrokerService'];


angularModule.push((scope, http, interval, messageBroker) => {
  console.log('define collectionsBarController');

  messageBroker.sub('collectionsbar.status collections current.collection', scope);
  scope.cfg = {};
  scope.status = 1;
  scope.collections = [];
  scope.currentCollection = '';

  scope.$on('collectionsbar.status', (e,status) => {console.log(scope.status = status);});

  scope.setCurrentCollection = () => {
    for(let col of scope.collections) {
      if(col.name == scope.currentCollection) {
        col.current = true;
      }
      else
        col.current = false;
    }
  }

  scope.$on('collections', (event, collections) => {
    scope.collections = collections;
    scope.setCurrentCollection();
  });
  scope.$on('current.collection', (e, currentCollection) => { scope.currentCollection = currentCollection; scope.setCurrentCollection();});



});


app.controller('collectionsBarController', angularModule);
