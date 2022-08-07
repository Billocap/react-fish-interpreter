import Interpreter from "./Interpreter"
import Pointer, { Direction } from "./Pointer"
import Stack from "./Stack"

type Input = () => string
type Output = (char: string) => void

interface IO {
  input: Input,
  output: Output
}

interface Flags {
  string: boolean,
  executing: boolean
}

class Program extends Interpreter{
  protected input: Input
  protected output: Output

  protected pointer: Pointer
  protected meta: Stack<Stack<any>>
  protected stack: Stack<any>
  protected call: Stack<[number, number]>
  protected code: string[]
  protected flags: Flags
  protected fisherman: [boolean, Direction]
  protected timer: number

  constructor(source: string, io: IO = {input: () => "", output: (char: string) => {console.log(char)}}) {
    super()

    this.input = io.input
    this.output = io.output
    
    this.code = source.split("\n")
    this.pointer = new Pointer()

    this.stack = new Stack()
    this.meta = new Stack()
    this.call = new Stack()
    this.meta.push(this.stack)

    this.flags = {
      string: false,
      executing: false
    }
    this.fisherman = [false, Direction.RIGHT]
    this.timer = -1
  }

  get executing() {
    return this.flags.executing
  }

  execute(time: number, callback: (char: string, pointer: {[index: string]: number}, stack: {[index: string]: any}) => void) {
    const {x, y} = this.pointer
    const char: string = this.code[y].charAt(x) || " "

    this.parse(char)

    this.pointer.step()
    this.boundary()

    var offset = 0

    for (let index = 0; index < y; index++) {
      offset += this.code[index].length + 1
    }

    offset += x

    callback(
      char,
      {x, y, offset, dir: this.pointer.dir},
      {stack: this.stack.content(), meta: this.meta.content()}
    )

    if (this.flags.executing) {
      if (this.timer > 0) {
        const temp = this.timer

        this.timer = -1

        setTimeout(() => {
          this.execute(time, callback)
        }, temp * 1000)
      } else {
        setTimeout(() => {
          this.execute(time, callback)
        }, time)
      }
    }
  }

  reset(source?: string) {
    this.code = source?.split("\n") || this.code
    this.pointer.turn(Direction.RIGHT)
    this.pointer.jump(0,0)
    this.flags = {
      string: false,
      executing: false
    }

    if (this.meta.length > 1) {
      this.meta.clear()
      this.stack = new Stack()
      this.meta.push(this.stack)
    } else {
      this.stack.clear()
    }
  }

  halt() {
    this.pointer.turn(Direction.RIGHT)
    this.pointer.jump(0,0)
    this.flags = {
      string: false,
      executing: false
    }

    if (this.meta.length > 1) {
      this.meta.clear()
      this.stack = new Stack()
      this.meta.push(this.stack)
    } else {
      this.stack.clear()
    }
  }

  pause() {
    this.flags.executing = false
  }

  resume() {
    this.flags.executing = true
  }

  private boundary() {
    const {x, y, dir} = this.pointer

    switch (dir) {
      case Direction.LEFT:
        if (x < 0) this.pointer.slide(this.code[y].length, 0)
        break

      case Direction.RIGHT:
        if (x >= this.code[y].length) this.pointer.slide(-this.code[y].length, 0)
        break

      case Direction.UP:
        if (y < 0) this.pointer.slide(0, this.code.length)
        break

      case Direction.DOWN:
        if (y >= this.code.length) this.pointer.slide(0, -this.code.length)
        break
    }
  }
}

export default Program