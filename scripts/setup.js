
var db = require("org/arangodb").db;
var textsCollectionName = applicationContext.collectionName("settings");

if (db._collection(textsCollectionName) === null) {
  db._create(textsCollectionName);
}

db._query( `UPSERT { _key: 'fastFilter' } 
            INSERT { _key: 'fastFilter', rules:{ 'none'             : {name:'none',              rule:"// none\n"},
                                                 'sort numeric asc' : {name:'sort numeric asc',  rule:'// sort numeric asc\nsort to_number(doc._key) asc'},
                                                 'sort numeric desc': {name:'sort numeric desc', rule:'// sort numeric desc\nsort to_number(doc._key) desc'}
                                               }}
            UPDATE {} IN ${textsCollectionName}`);
