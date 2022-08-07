import { useRef, useState } from 'react'

import { CodeBox } from './components/CodeBox'
import { CodeEditor } from './components/CodeEditor'
import { Console } from './components/Console'
import { ControlPanel } from './components/ControlPanel'
import { StackView } from './components/StackView'
import Program from './lib/Program'

function App() {
  const [code, setCode] = useState(`!v"Hello, World!"r!\n >l?!;o`)
  const [codeBox, setCodeBox] = useState("")
  const [output, setOutput] = useState("")
  const [stack, setStack] = useState([])
  const [pointer, setPointer] = useState({x: 0, y: 0})
  const [speed, setSpeed] = useState(1)

  const io = useRef({
    input: () => {
      return window.prompt("Type something") || ""
    },
    output: (char: string) => {
      setOutput(prev => prev + char)
    }
  })

  const program = useRef(new Program(code, io.current))

  function execute() {
    program.current.resume()

    try {
      program.current.execute(speed, (_, pointer, info) => {
        setStack(info.stack)
  
        setPointer({
          x: pointer.x,
          y: pointer.y
        })
      })
    } catch(e) {
      alert("Something smells fish...")
    }
  }

  return (
    <div className="app v flexbox">
      <div className="top-bar">
        <ControlPanel
          controls={{
            play() {
              setCodeBox(code)

              execute()
            },
            pause() {
              program.current.pause()
            },
            stop() {
              program.current.halt()

              setOutput("")
              setCodeBox("")
            },
            reset() {
              program.current.reset(code)

              setCodeBox(code)
              setOutput("")

              execute()
            },
            setSpeed
          }}
        />
        <nav className="h flexbox">
          <a href="https://esolangs.org/wiki/Fish" target="_blank">
            Wiki
          </a>
          <a href="https://github.com/Billocap/react-fish-interpreter" target="_blank">
            Repository
          </a>
        </nav>
      </div>
      <div className="h flexbox section">
        <CodeEditor
          code={code}
          setCode={setCode}
        />
        <div className="v flexbox section">
          <CodeBox
            code={codeBox}
            pointer={pointer}
          />
          <div className="h flexbox section" style={{
            height: "40%",
            flexShrink: 0
          }}>
            <Console
              output={output}
            />
            <StackView
              stack={stack}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
