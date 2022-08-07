import { Stack } from "phosphor-react"
import { FC } from "react"

import "./StackView.css"

type StackViewProps = {
  stack: any[]
}

const StackView: FC<StackViewProps> = function({
  stack
}) {
  const stackContent = stack.map((item, id) => {
    return (
      <pre className="stack-item" key={`${id}-${new Date().getTime()}`}>
        {typeof item == "string" ? `"${item}"` : item}
      </pre>
    )
  })

  return (
    <div className="stack v flexbox">
      <p className="title">
        <Stack size={15} weight="fill"/>
        Stack
      </p>
      <div className="stack-view">
        {stackContent}
      </div>
    </div>
  )
}

export default StackView
