/**
 * 文件树变形处理
 * @param data 文件树
 * @returns {Array}
 */
function transformer(data) {
  const isMdFile = obj => obj.type === 'File' && /md$/i.test(obj.name) && !/README\.md/i.test(obj.name)
  const hasMdInChildren = obj => obj.children && obj.children.some(isMdFile)
  const renameDir = obj => obj.name = `${obj.name}   ${obj.children.filter(isMdFile)[0].name.split('.')[0]}`

  const markKeep = obj => {
    return obj.type === 'Directory'
      && hasMdInChildren(obj)
      && renameDir(obj)
      && (obj.$_keep = true)
  }

  const walkMarkKeep = obj => {
    if (obj.type === 'Directory') {
      markKeep(obj)
      obj.children && obj.children.forEach(walkMarkKeep)
      obj.$_keep = obj.$_keep || (obj.children && obj.children.some(childObj => childObj.$_keep))
    }
  }
  data.forEach(walkMarkKeep)

  const walkFilter = arr => {
    let newArr = arr.filter(obj => obj.$_keep && obj.type === 'Directory')
    newArr.forEach(obj => {
      if (obj.children) obj.children = walkFilter(obj.children)
    })
    return newArr
  }

  let newArr = walkFilter(data)
  return newArr
}

module.exports = transformer