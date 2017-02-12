'use strict';

const fs = require('fs');

const createRouter = require('@arangodb/foxx/router');
const router = createRouter();

module.context.use(router);



router.get('/collections',(req, res) => res.json({ settings: module.context.collectionName('settings') }) );


router.get('/*', (req, res) => {
  const base     = module.context.basePath;
  const filePath = `${base}/public/${req.suffix}`;

  if (fs.isFile(filePath)) {
    res.sendFile(filePath);
  } else {
    res.sendFile(`${base}/public/index.html`);
  }
});
