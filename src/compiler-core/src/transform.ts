import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export function transform(root, options = {}) {
  // transform
  // 1.遍历--深度优先搜索
  // 2.修改 text content
  const context = createTransformContext(root, options);
  traverseNode(root, context);

  // root.codegenNode
  createRootCodegenNode(root);

  root.helpers = [...context.helpers.keys()];
}

function createRootCodegenNode(root) {
  root.codegenNode = root.children[0];
}

function traverseNode(node, context) {
  console.log(node);

  const nodeTransforms = context.nodeTransforms;
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node);
  }

  transformChildren(node, context);
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || [],
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1);
    },
  };
  return context;
}

function transformChildren(node, context) {
  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING);
      break;
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context)
      break
    default: 
      break
  }

 
}

function traverseChildren(node, context) {
   const children = node.children;
   for (let i = 0; i < children.length; i++) {
     const node = children[i];
     traverseNode(node, context);
   }
}