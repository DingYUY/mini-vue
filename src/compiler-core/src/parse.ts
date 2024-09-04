import { NodeTypes } from "./ast";

export function baseParse(content) {
  const context = createParserContext(content);

  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  let nodes: any = [];

  let node: any

  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  }

  nodes.push(node);

  return nodes;
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(closeDelimiter, openDelimiter.length)
  
  advanceBy(context, openDelimiter.length)
  context.source.trim()

  const rawLength = closeIndex - openDelimiter.length

  const content = context.source.slice(0, rawLength);

  advanceBy(context, rawLength + closeDelimiter.length)

  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content: content,
    },
  };
}

function advanceBy(context, length) {
  context.source = context.source.slice(length);
}

function createRoot(children) {
  return {
    children,
  };
}

function createParserContext(content) {
  return {
    source: content,
  };
}
