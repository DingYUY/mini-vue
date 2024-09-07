export function transform(root, options = {}) {
  // transform
  // 1.遍历--深度优先搜索
  // 2.修改 text content
  const context = createTransformContext(root, options)
  traverseNode(root, context);

  // root.codegenNode
  createRootCodegenNode(root)
}

function createRootCodegenNode(root) { 
  root.codegenNode = root.children[0]
}

function traverseNode(node, context) {
  console.log(node);

  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }

  transformChildren(node, context)
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
  return context
}

function transformChildren(node, context) { 
  const children = node.children;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      traverseNode(node, context);
    }
  }
}