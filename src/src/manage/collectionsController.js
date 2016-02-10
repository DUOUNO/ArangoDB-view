/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope', 'messageBrokerService'];

angularModule.push((scope, messageBroker) => {
  messageBroker.pub('current.collection', '');
  messageBroker.pub('collections.reload');
});

app.controller('collectionsController', angularModule);
