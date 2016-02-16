/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope', '$http', '$routeParams', 'messageBrokerService', 'formatService', '$q'];

angularModule.push((scope, http, params, messageBroker, formatService, q) => {
  scope.format = formatService;
  scope.Number = Number;
  messageBroker.pub('current.collection', '');

  scope.indexBucketSizes = {};
  for(let i = 1; i <= 1024; i=i*2) scope.indexBucketSizes[i] = 1;

  http.get(`/_db/${params.currentDatabase}/_api/collection`).then(data => {
    scope.collections = data.data.collections;
    scope.figures     = {};

    let qs = scope.collections.map( (col) => {
      col.expanded = false;
      if(col.status == 3) {
        return http.get(`/_db/${params.currentDatabase}/_api/collection/${col.id}/properties`)
      } else {
        let d = q.defer();
        d.resolve({data:{}});
        return d.promise;
      }
    });

    q.all(qs).then( (vals) => vals.forEach((res, idx) => Object.assign(scope.collections[idx], res.data)) );
  });

  scope.orderCollection = (col) => `${!col.isSystem}_${col.name}`;

  scope.getFigures = (col, open) => {
    if(!open) return;
    if(col.status == 3) {
      http.get(`/_db/${params.currentDatabase}/_api/collection/${col.name}/figures`).then(data => scope.figures[col.name] = data.data.figures);
    } else {
      scope.figures[col.name] = 'not loaded';
    }
  }
});

app.controller('collectionsController', angularModule);
