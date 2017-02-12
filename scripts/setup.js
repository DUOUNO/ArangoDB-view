'use strict';

const db = require('@arangodb').db;
const textsCollectionName = module.context.collectionName('settings');

if (db._collection(textsCollectionName) === null) {
  db._create(textsCollectionName);
}

db._query( `UPSERT { _key: 'fastFilter' } 
            INSERT { _key: 'fastFilter', rules:{ 'none'             : {name:'none',              rule:"// none\n"},
                                                 'sort numeric asc' : {name:'sort numeric asc',  rule:'// sort numeric asc\nsort to_number(doc._key) asc'},
                                                 'sort numeric desc': {name:'sort numeric desc', rule:'// sort numeric desc\nsort to_number(doc._key) desc'}
                                               }}
            UPDATE {} IN ${textsCollectionName}`);


db._query( `UPSERT { _key: 'savedQueries' }
            INSERT { _key: 'savedQueries', queries:{ 'unsaved': {"name": "unsaved",
                                                                 "query": "// eval:asap max:all table:true name:unsaved\n// query\n\n",
                                                                 "options": {
                                                                   "table": true,
                                                                   "eval": "asap",
                                                                   "max": "all",
                                                                   "name": "unsaved"
                                                                  }
                                                                }
                                                   }
                   }
            UPDATE {} IN ${textsCollectionName}`);