import * as _ from 'lodash'

export function findNode (data, selector) {
  var nodes = _.filter(data, selector)
  if (nodes && nodes.length === 1) {
    return nodes[0]
  }

  var foundNode = null

  _.forEach(data, d => {
    if (!foundNode) {
      foundNode = findNode(d.children, selector)
    }
  })

  return foundNode
}

export function findParent (data, nodeSelector) {
  var node = findNode(data, nodeSelector)
  if (!node) {
    return null
  }

  return node.parent
}