/***
 * (c) 2016 by duo.uno
 *
 ***/

import app from 'app'


let angularModule = ['$scope', '$http', '$routeParams', 'messageBrokerService', '$q'];

angularModule.push((scope, http, params, messageBroker, q) => {
  messageBroker.pub('current.collection', '');

  http.get(`/_db/${params.currentDatabase}/_api/collection`).then(data => {
    scope.collections = data.data.collections;

    let qs = scope.collections.map( (col) => {
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
});

app.controller('collectionsController', angularModule);
