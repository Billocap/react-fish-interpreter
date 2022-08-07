import Pointer, { Direction } from "./Pointer"
import Stack from './Stack'

type Input = () => string
type Output = (char: string) => void

interface Flags {
  string: boolean,
  executing: boolean
}

abstract class Interpreter {
  protected abstract input: Input
  protected abstract output: Output

  protected abstract pointer: Pointer
  protected abstract meta: Stack<Stack<any>>
  protected abstract stack: Stack<any>
  protected abstract call: Stack<[number, number]>
  protected abstract code: string[]
  protected abstract flags: Flags
  protected abstract fisherman: [boolean, Direction]
  protected abstract timer: number

  private movement(char: string) {
    const dirs = ">v<^"
    const {dir} = this.pointer

    if (dirs.includes(char)) this.pointer.turn(dirs.indexOf(char))

    if (char == "x") this.pointer.turn(Math.floor(4 * Math.random()))

    if (dir == Direction.RIGHT || dir == Direction.LEFT) {
      this.fisherman[1] = dir
    }

    if (char == "`") {
      if (dir == Direction.RIGHT || dir == Direction.LEFT) {
        this.pointer.turn(this.fisherman[0] ? Direction.UP : Direction.DOWN)

        this.fisherman[0] = !this.fisherman[0]
        this.fisherman[1] = dir
      }

      if (dir == Direction.UP || dir == Direction.DOWN) {
        this.pointer.turn(this.fisherman[1])

        this.fisherman[1] = dir
      }
    }
  }

  private mirror(char: string) {
    const {dir} = this.pointer

    switch (char) {
      case "\\":
        if (dir == Direction.RIGHT || dir == Direction.LEFT) {
          this.pointer.right()
        } else {
          this.pointer.left()
        }
        break
      
      case "/":
        if (dir == Direction.RIGHT || dir == Direction.LEFT) {
          this.pointer.left()
        } else {
          this.pointer.right()
        }
        break

      case "|":
        if (dir == Direction.RIGHT || dir == Direction.LEFT) this.pointer.flip()
        break
      
      case "_":
        if (dir == Direction.UP || dir == Direction.DOWN) this.pointer.flip()
        break
      
      case "#":
        this.pointer.flip()
        break
    }
  }

  private swin(char: string) {
    switch (char) {
      case "O":
        this.pointer.rise()
        break

      case "u":
        this.pointer.dive()
        break
    }
  }

  private math(char: string) {
    if (this.pointer.diving) return

    const x = this.stack.pop()
    const y = this.stack.pop()

    if (char === "," && x === 0) throw new Error("Division by zero.")

    this.stack.push(eval(`${y}${char}${x}`.replace(",","/")))
  }

  private boolean(char: string) {
    if (this.pointer.diving) return

    const x = this.stack.pop()
    const y = this.stack.pop()

    switch (char) {
      case "=":
        this.stack.push((y == x ? 1 : 0))
        break

      case "(":
        this.stack.push((y < x ? 1 : 0))
        break

      case ")":
        this.stack.push((y > x ? 1 : 0))
        break
    }
  }

  private jump(char: string) {
    if (this.pointer.diving) return

    switch (char) {
      case "!":
        this.pointer.skip(1)
        break
      
      case "?":
        if (this.stack.pop() == 0) this.pointer.skip(1)
        break
      
      case ".":
        const y = this.stack.pop()
        const x = this.stack.pop()
        this.pointer.jump(x, y)
        break
    }
  }

  private stackmanip(char: string) {
    if (this.pointer.diving) return

    switch (char) {
      case "r":
        this.stack.revert()
        break

      case "l":
        this.stack.push(this.stack.length)
        break
      
      case "}":
        this.stack.shift("right")
        break
      
      case "{":
        this.stack.shift("left")
        break

      case "[":
        const _x = this.stack.pop()
        if (_x > 0) {
          this.meta.push(new Stack().from(this.stack.slice(_x)))
        } else {
          this.meta.push(new Stack())
        }
        this.stack = this.meta.peek()
        break
      
      case "]":
        const add = this.meta.pop() as Stack<any>
        this.stack = this.meta.peek()
        this.stack.insert(add.slice(add.length))
        break

      case "$":
        this.stack.swap()
        break

      case "@":
        this.stack.tswap()
        break

      case "~":
        this.stack.pop()
        break

      case ":":
        this.stack.double()
        break

      case "I":
        this.stack = this.meta.right()
        break

      case "D":
        this.stack = this.meta.left()
        break
    }
  }

  private io(char: string) {
    if (this.pointer.diving) return

    if (char != "i") var c = this.stack.pop()
    switch (char) {
      case "o":
        if (typeof c == "number") {
          this.output(String.fromCharCode(c))

          break
        }

        this.output(c)
        
        break
      
      case "n":
        if (typeof c == "string") {
          this.output(c.charCodeAt(0).toString())

          break
        }

        this.output(c.toString())

        break
      
      case "i":
        this.stack.push(this.input())
        break
    }
  }

  private misc(char: string) {
    if (this.pointer.diving) return

    switch (char) {
      case "&":
        this.stack.register()
        break

      case "g":
        const y_ = this.stack.pop()
        const x_ = this.stack.pop()
        const v_ = this.code[y_] ? this.code[y_].charAt(x_) || 0 : 0

        this.stack.push(v_)
        break

      case "p":
        const _y = this.stack.pop()
        const _x = this.stack.pop()
        const _v = this.stack.pop()

        if (_y > this.code.length + 1) {
          this.code = this.code.concat(new Array(_y - (this.code.length - 1)).fill(""))
        }

        if (_x > this.code[_y].length + 1) {
          this.code[_y] = this.code[_y].concat(" ".repeat(_x - (this.code[_y].length - 1)))
        }

        this.code[_y] = this.code[_y].slice(0, _x) + _v + this.code[_y].slice(_x + 1, this.code[_y].length)
        break

      case "":
        this.flags.executing = false
        break
      
      case " ":
        break

      case "h":
        this.stack.push(new Date().getHours())
        break

      case "m":
        this.stack.push(new Date().getMinutes())
        break

      case "s":
        this.stack.push(new Date().getSeconds())
        break

      case "S":
        this.timer = parseInt(this.stack.pop())
        break
    }
  }

  private literals(char: string) {
    if (this.pointer.diving) return

    this.stack.push(parseInt(char, 16))
  }

  private functions(char: string) {
    if (this.pointer.diving) return

    const {x, y} = this.pointer

    switch (char) {
      case "C":
        const _y = this.stack.pop()
        const _x = this.stack.pop()
        this.call.push([x, y])
        this.pointer.jump(_x, _y)
        break

      case "R":
        const [x_, y_] = this.call.pop()
        this.pointer.jump(x_, y_)
        break
    }
  }

  private apply(char: string, rules: [string, Function][]) {
    for (let rule of rules) {
      const [test, action] = rule

      if (test.includes(char)) {
        action.call(this, char)

        return true
      }
    }

    return false
  }

  private stringmode(char: string) {
    if (char.match(/'|"/)) this.flags.string = !this.flags.string
    
    if (this.flags.string && !char.match(/'|"/)) this.stack.push(char)
  }

  protected parse(char: string) {
    this.stringmode(char)

    if (!this.flags.string) {
      const valid = this.apply(char, [
        ["0123456789abcdef", this.literals],
        [":~${}rl[]@ID", this.stackmanip],
        ["&gp hmsS", this.misc],
        ["v><^x`", this.movement],
        ["|_\\/#", this.mirror],
        ["+*,%-", this.math],
        ["=()", this.boolean],
        ["!?.", this.jump],
        ["ion", this.io],
        ["uO", this.swin],
        ["CR", this.functions]
      ])

      if (!"'\"".includes(char) && !valid) {
        throw new Error("Invalid instruction")
      }
    }
  }
}

export default Interpreter