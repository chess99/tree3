var { result } = require('../src/API');
var transformer = require('../src/treeTransformer');

result({ 
  save: true, 
  ignore: [], 
  dir: process.cwd(), 
  transformer 
})