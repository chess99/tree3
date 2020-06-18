var { result } = require('./API');
var transformer = require('./treeTransformer');

result({ 
  save: true, 
  ignore: [], 
  dir: process.cwd(), 
  transformer 
})