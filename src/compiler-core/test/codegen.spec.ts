import { generate } from "../src/codegen"
import { baseParse } from "../src/parse"
import { transform } from "../src/transform"
import { transformExpression } from "../src/transforms/transformExpression"
import { transformText } from "../src/transforms/transformText"
import { transformElement } from "../src/transforms/trensformElement"


describe('codegen', () => {
  it('string', () => { 
    const ast = baseParse("hi")
    transform(ast)
    const { code } = generate(ast)
    // 快照测试
    expect(code).toMatchSnapshot()
  })

  it('interpolation', () => { 
    const ast = baseParse("{{message}}")
    transform(ast, {
      nodeTransforms: [transformExpression],
    });
    const { code } = generate(ast)
    // 快照测试
    expect(code).toMatchSnapshot()
  })

  it.only('element', () => {
    const ast = baseParse("<div>hi,{{message}}</div>");
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText],
    });
    const { code } = generate(ast)
    // 快照测试
    expect(code).toMatchSnapshot()
  })
})