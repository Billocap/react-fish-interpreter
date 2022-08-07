import { TextAlignLeft } from "phosphor-react"
import { FC } from "react"

type CodeEditorProps = {
  code: string,
  setCode: any
}

const CodeEditor: FC<CodeEditorProps> = function({
  code, setCode
}) {
  return (
    <div className="editor section">
      <p className="title">
        <TextAlignLeft size={15} weight="fill"/>
        Editor
      </p>
      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        className="space"
      ></textarea>
    </div>
  )
}

export default CodeEditor
