/***
 * (c) 2016 by duo.uno
 *
 ***/
 
import app from 'app'

  let angularModule = ['$http', '$q', 'messageBrokerService'];


  angularModule.push((http, q, messageBroker) => {

    return {
      query:(query) => {
        let d = q.defer();
        console.log('AQL-QUERY', query);
        http.post(`/_db/${messageBroker.last('current.database')}/_api/cursor`, {cache:false,query:query}).then(data => d.resolve(data.data.result));
        return d.promise;
      }
    }
  });

  app.service('queryService', angularModule);
