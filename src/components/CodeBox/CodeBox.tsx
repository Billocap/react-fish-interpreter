import { Code } from "phosphor-react"
import { FC } from "react"

import "./CodeBox.css"

type CodeBoxProps = {
  code: string,
  pointer: {
    x: number,
    y: number
  }
}

const CodeBox: FC<CodeBoxProps> = function({
  code, pointer
}) {
  let codeLines = code.split("\n")

  let width = 0
  for (const line of codeLines) {
    width = Math.max(width, line.length)
  }

  codeLines = codeLines.map(line => {
    const diff = width - line.length

    return line + " ".repeat(diff)
  })

  const codeLinesAsElement = codeLines.map((codeLine, y) => {
    const chars = codeLine.split("")

    const charsAsElement = chars.map((char, x) => {
      const isCurrent = pointer.x == x && pointer.y == y

      return (
        <pre
          key={x + " " + y}
          className={isCurrent ? "current" : ""}
        >
          {char}
        </pre>
      )
    })

    return (
      <span className="code-line" key={y}>
        {charsAsElement}
      </span>
    )
  })

  return (
    <div className="code-box section">
      <p className="title">
        <Code size={15} weight="fill"/>
        Code Box
      </p>
      <div className="space code">
        {codeLinesAsElement}
      </div>
    </div>
  )
}

export default CodeBox
