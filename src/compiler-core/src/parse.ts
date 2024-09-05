import { NodeTypes, TagTypes } from "./ast";

export function baseParse(content) {
  const context = createParserContext(content);

  return createRoot(parseChildren(context, ''));
}

function parseChildren(context, parentTag) {
  let nodes: any = [];

  while (!isEnd(context, parentTag)) {
    let node: any;
    const s = context.source;
    if (s.startsWith("{{")) {
      node = parseInterpolation(context);
    } else if (s[0] === "<") {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context);
      }
    }

    if (!node) {
      node = parseText(context);
    }

    nodes.push(node);
  }

  return nodes;
}

function isEnd(context, parentTag) {
  const s = context.source;

  // 遇到结束标签时
  if (parentTag && s.startsWith(`</${parentTag}>`)) {
    return true;
  }

  // 1.source有值时
  return !s
}

function parseText(context) {
  let endIndex = context.source.length;
  const endTokens = ["<", "{{"];

  console.log('source', context.source)
  
  for (let i = 0; i < endTokens.length; i++) {
    const index = context.source.indexOf(endTokens[i]);
    if (index !== -1 && endIndex > index) {
      endIndex = index;
    }
  }

  const content = parseTextData(context, endIndex);

  return {
    type: NodeTypes.TEXT,
    content,
  };
}

function parseTextData(context, length) {
  const content = context.source.slice(0, length);
  advanceBy(context, length);
  return content;
}

function parseElement(context) {
  const element: any = parseTag(context, TagTypes.START);

  element.children = parseChildren(context, element.tag);

  parseTag(context, TagTypes.END);

  return element;
}

function parseTag(context: any, type: TagTypes) {
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  const tag = match[1];
  advanceBy(context, match[0].length);
  advanceBy(context, 1);

  if (type === TagTypes.END) return;

  return {
    type: NodeTypes.ELEMENT,
    tag
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

  const content = parseTextData(context, rawLength);

  advanceBy(context, closeDelimiter.length);

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
