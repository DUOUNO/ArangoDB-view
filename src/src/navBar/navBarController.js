/***
 * (c) 2016 by duo.uno
 *
 ***/

let stat = `LET r = (FOR d IN _statistics sort d.time desc limit @time RETURN d)
let x = MERGE(FOR t IN ['http', 'client', 'system']
let z = MERGE(FOR a IN ATTRIBUTES(r[0][t])
filter !CONTAINS(a, 'Percent')
RETURN {[a]: sum(r[*][t][a]) / @time})
RETURN {[t]:z}) RETURN x`

import app from 'app'

let angularModule = ['$scope', '$http', '$interval', 'formatService', 'messageBrokerService'];


angularModule.push((scope, http, interval, format, messageBroker) => {
  scope.format = format;

  scope.collectionsBarStatus = 1;
  scope.changeCollectionsBarStatus = () => {scope.collectionsBarStatus++; if(scope.collectionsBarStatus>1)scope.collectionsBarStatus=0; messageBroker.pub('collectionsbar.status', scope.collectionsBarStatus);}

  http.get('/_db/_system/_api/version').then(data => scope.cfg.arango = data.data);
  http.get('/_api/database').then(data => scope.cfg.dbs = data.data.result);
  
  scope.cfg = {};
  scope.cfg.arango = 'n/a';
  scope.cfg.dbs = ['_system'];
  scope.cfg.selectedDb = '_system';
  scope.cfg.collections = []

  scope.loadCollectionsInfo = () => {
    http.get(`/_db/${scope.cfg.selectedDb}/_api/collection`).then((data) => { 
      scope.cfg.collections = data.data.collections;
      messageBroker.pub('current.database', scope.cfg.selectedDb);
      messageBroker.pub('collections', scope.cfg.collections);
    });
  }
  scope.loadCollectionsInfo()


  scope.loadCollectionInfo = () => {
    if(!scope.cfg.selectedCollection) return;
    http.get(`/_db/${scope.cfg.selectedDb}/_api/collection/${scope.cfg.selectedCollection.name}/count`).then(data => console.log(scope.cfg.selectedCollectionInfo = data.data));
  }


  scope.groupCollections = (collection) => {
    if(collection.isSystem) {
      return 'system collections';
    } else {
      return 'user collections';
    }
  }

  scope.refreshStats = () => {
    http.post(`/_db/_system/_api/cursor`, {cache:false,query:stat,bindVars:{time:6}}).then(data => scope.cfg.stats = data.data.result[0]);
  }
  scope.refreshStats();
  interval(scope.refreshStats, 10 * 1000);

  messageBroker.sub('collections.reload', scope);
  scope.$on('collections.reload', () => scope.loadCollectionsInfo());

});


app.controller('navBarController', angularModule);
