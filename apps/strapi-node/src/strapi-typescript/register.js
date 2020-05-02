require('ts-node/register');
require('tsconfig-paths/register');
const { join } = require('path');
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
  './load-apis': join(__dirname, 'load-apis'),
  './filepath-to-prop-path': join(__dirname, 'filepath-to-prop-path')
})
