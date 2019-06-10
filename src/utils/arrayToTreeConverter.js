import * as _ from 'lodash'

export function createTree (array, parentIdProperty, idProperty, parentIdValue, childrenProperty, fieldMappings) {
  const tree = []
  const nodes = _.filter(array, [parentIdProperty, parentIdValue])
  _.forEach(nodes, node => {
    const newNode = {
      data: node
    }
    mapFields(node, newNode, fieldMappings)
    newNode[childrenProperty] = createTree(
      array,
      parentIdProperty,
      idProperty,
      node[idProperty],
      childrenProperty,
      fieldMappings
    )

    tree.push(newNode)
  })
  return tree
}

export function mapFields (node, newNode, fieldMappings) {
  _.forEach(fieldMappings, fieldMapping => {
    if (!fieldMapping['target']) {
      return
    }

    if (fieldMapping.hasOwnProperty('value')) {
      newNode[fieldMapping['target']] = fieldMapping['value']
    } else if (fieldMapping['source']) {
      newNode[fieldMapping['target']] = node[fieldMapping['source']]
    } else if (fieldMapping['targetFunction']) {
      newNode[fieldMapping['target']] = fieldMapping['targetFunction'](node)
    }
  })
}

