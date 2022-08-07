import { TerminalWindow } from "phosphor-react"
import { FC } from "react"

type ConsoleProps = {
  output: string
}

const Console: FC<ConsoleProps> = function({
  output
}) {
  return (
    <div className="console section">
      <p className="title">
        <TerminalWindow size={15} weight="fill"/>
        Terminal
      </p>
      <pre className="space">
        {output}
      </pre>
    </div>
  )
}

export default Console
