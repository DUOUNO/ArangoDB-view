/***
 * (c) 2016 by duo.uno
 *
 ***/
 
import app from 'app'

  let angularModule = ['$route', '$routeParams', 'queryService', '$q'];


  angularModule.push((route, params, query, q) => {

    return {
      test:() => {
        let d = q.defer();

        let {from, to, index} = params;
        from            = Number(from);
        to              = Number(to);
        index           = Number(index);
        let offset      = from + index - 1;
        let batchSize   = to - from + 1;
        let prevDocLink = '', nextDocLink = '', docsLink = '';

        let limit = 3;
        if(offset < 0) {
          offset = 0;
          limit  = 2;
        } // if
        query.query(`for doc in ${params.collectionName} limit ${offset},${limit} return doc._key`).then(result => {
          // scope._keys = result;
          let newIndex = index + 1;
          if(newIndex > batchSize-1) {
            nextDocLink = `collection/${params.collectionName}/${from + batchSize}/${to + batchSize}/0/document/${result.slice(-1)[0]}`;
          } else {
            nextDocLink = `collection/${params.collectionName}/${from}/${to}/${index+1}/document/${result.slice(-1)[0]}`;
          }
          newIndex = index-1;
          if(newIndex < 0) {
            prevDocLink = `collection/${params.collectionName}/${from - batchSize}/${to - batchSize}/${batchSize-1}/document/${result.slice(0,1)[0]}`;
          } else {
            prevDocLink = `collection/${params.collectionName}/${from}/${to}/${index-1}/document/${result.slice(0,1)[0]}`;
          }
          docsLink = `collection/${params.collectionName}/${from}/${to}`;
          d.resolve({docsLink, prevDocLink, nextDocLink, _keys:result});
        });
        return d.promise;
      }
    }
  });

  app.service('testService', angularModule);
