import { NodeTypes, TagTypes } from "./ast";

export function baseParse(content) {
  const context = createParserContext(content);

  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  let nodes: any = [];

  let node: any;

  if (context.source.startsWith("{{")) {
    node = parseInterpolation(context);
  } else if (context.source.startsWith("<")) {
    node = parseElement(context);
  }

  nodes.push(node);

  return nodes;
}

function parseElement(context) {
  const element = parseTag(context, TagTypes.START);
  
  parseTag(context, TagTypes.END);
  
  return element
}

function parseTag(context: any, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagTypes.END) return;

  return {
    type: NodeTypes.ELEMENT,
    tag,
  };
}

function parseInterpolation(context) {
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  );

  advanceBy(context, openDelimiter.length);
  context.source.trim();

  const rawLength = closeIndex - openDelimiter.length;

  const content = context.source.slice(0, rawLength);

  advanceBy(context, rawLength + closeDelimiter.length);

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
