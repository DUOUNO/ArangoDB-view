/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope']

angularModule.push((scope) => {

scope.test = {};

  // scope.test.selected = 'a';


  // scope.test.options = {
  //   kc: {name:'name c', rule:'rule c'},
  //   ka: {name:'name a', rule:'rule a'},
  //   kb: {name:'name b', rule:'rule b'},
  //   kd: {name:'name d', rule:'rule d'}
  // }

});

app.controller('homeController', angularModule);
