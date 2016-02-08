/***
 * (c) 2016 by duo.uno
 *
 ***/
 
import app from 'app'


let angularModule = ['$scope', '$routeParams', '$http', 'messageBrokerService', 'queryService', 'formatService', 'testService'];

angularModule.push((scope, params, http, messageBroker, query, format) => {
  scope.format = format;
  messageBroker.pub('current.collection', params.collectionName);

  scope.params = params;
  let from = scope.from = Number(params.from);
  let to   = scope.to   = Number(params.to);
  scope.batchSize = to - from + 1;
  scope.docs = [];

  http.get(`/_db/${messageBroker.last('current.database')}/_api/collection/${params.collectionName}/count`).then(data => {
    console.log(scope.collectionInfo = data.data);
    messageBroker.pub('collections.reload');

    let pages = Math.ceil(scope.collectionInfo.count/scope.batchSize);

    let curpage = from / scope.batchSize + 1;

    let left = curpage - 1;
    let right = pages - curpage;

    let arr = [];
    arr.push(curpage);

    for(let i = 1; i <= 3; i++) {
      if(left-i >= 0) {
        arr.unshift(curpage-i);
      }
      if(right-i >= 0) {
        arr.push(curpage+i);
      }
    } // for

    let attrLength = Math.floor(arr.length/2);

    for(let i = 2; i<right - attrLength && i < 20; i++) {
      let n = curpage +  Math.round(Math.pow(Math.E, i));
      if(n >= pages) break;
      arr.push(n);
    }

    for(let i = 2; i<left - attrLength && i < 20; i++) {
      let n = curpage -  Math.round(Math.pow(Math.E, i));
      if(n < 2) break;
      arr.unshift(n);
    }

    if(attrLength < right && -1 == arr.indexOf(pages)) arr.push(pages);
    if(attrLength < left  && -1 == arr.indexOf(1))     arr.unshift(1);

    scope.pages = arr;


    query.query(`for doc in ${params.collectionName} let attr = slice(attributes(doc), 0, 20)  limit ${params.from},${scope.batchSize} return keep(doc, attr)`).then(results => {
      scope.docs = results;
      for(let doc of scope.docs) {
        delete doc._rev;
        delete doc._id;
      }
    });
  });
});

app.controller('collectionController', angularModule);



// FOR x IN @@collection LET att = SLICE(ATTRIBUTES(x), 0, 25) SORT TO_NUMBER(x._key) == 0 ? x._key : TO_NUMBER(x._key) LIMIT @offset, @count RETURN KEEP(x, att)"
