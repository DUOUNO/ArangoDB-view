/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope', '$http', '$routeParams', 'messageBrokerService', 'formatService', '$q'];

angularModule.push((scope, http, params, messageBroker, formatService, q) => {
  scope.format = formatService;
  scope.params = params;
  scope.Number = Number;
  messageBroker.pub('current.collection', '');

  scope.indexBucketSizes = {};
  for(let i = 1; i <= 1024; i=i*2) scope.indexBucketSizes[i] = 1;

  http.get(`/_db/${params.currentDatabase}/_api/collection`).then(data => {
    scope.collections = data.data.collections;
    scope.colIds      = {}; // map colId to collections[]
    scope.indexes     = {};

    scope.collections.forEach((col) => {
      col.expanded = false;
      col.editName = col.name;
      scope.colIds[col.id] = col;
    });
  });

  scope.orderCollection = (col) => `${!col.isSystem}_${col.name}`;

  scope.getFigures = scope.loadColDetails = (col, open) => {
    if(!open) return;
    if(col.status == 3) {
      http.get(`/_db/${params.currentDatabase}/_api/collection/${col.id}/figures`).then(data => Object.assign(scope.colIds[col.id], data.data));
      http.get(`/_db/${params.currentDatabase}/_api/index?collection=${col.id}`).then(data   => scope.indexes[col.id] = data.data.indexes);
    } // if
  };

  scope.doAction = (action, col) => {
    if(col.status == 2 && action != 'load') return;
    console.log(action, col);
    let promise;
    switch(action) {
      case 'load':
        promise = http.put(`/_db/${params.currentDatabase}/_api/collection/${col.name}/load`, {count:false});
        break;

      case 'unload':
        promise = http.put(`/_db/${params.currentDatabase}/_api/collection/${col.name}/unload`);
        break;

      case 'truncate':
        if (! confirm('Really truncate collection?') ) return;
        promise = http.put(`/_db/${params.currentDatabase}/_api/collection/${col.name}/truncate`);
        break;
    } // switch

    promise.then( (data) => {
      console.log('promise resolved data', data);
      switch(action) {
        case 'load':
          messageBroker.pub('collections.reload');
          col.status = 3;
          scope.loadColDetails(col, true);
          break;

        case 'unload':
          col.status  = 2;
          col.figures = {};
          delete scope.indexes[col.id];
          messageBroker.pub('collections.reload');
          break;

        case 'truncate':
          scope.loadColDetails(col, true);
          break;
      } // switch
    });
  };
});

app.controller('collectionsController', angularModule);
