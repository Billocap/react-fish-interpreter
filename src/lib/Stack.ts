class Stack<Type> {
  private elements: Type[]
  private reg: Type | undefined
  private pointer: number

  constructor() {
    this.elements = []
    this.reg = undefined
    this.pointer = 0
  }

  push(data: Type) {
    this.elements.push(data)

    return this
  }

  pop(): Type {
    if (this.elements.length == 0) throw new Error("Stack is empty.")
    
    return this.elements.pop() as Type
  }

  peek() {
    return this.elements[this.elements.length - 1]
  }

  swap() {
    if (this.elements.length < 2) throw new Error("Not enough items.")

    const val1 = this.pop()
    const val2 = this.pop()

    this.push(val1)
    this.push(val2)

    return this
  }

  tswap() {
    if (this.elements.length < 3) throw new Error("Not enough items.")

    const val1 = this.pop()
    const val2 = this.pop()
    const val3 = this.pop()

    this.push(val1)
    this.push(val3)
    this.push(val2)

    return this
  }

  double() {
    if (this.elements.length == 0) throw new Error("Stack is empty.")

    this.push(this.peek())

    return this
  }

  revert() {
    if (this.elements.length == 0) throw new Error("Stack is empty.")

    this.elements.reverse()

    return this
  }

  shift(direction: "left" | "right") {
    if (this.elements.length == 0) throw new Error("Stack is empty.")

    switch (direction) {
      case "left":
        this.push(this.elements.shift() as Type)
        break

      case "right":
        this.elements.unshift(this.pop())
        break
    }

    return this
  }

  register() {
    if (this.reg != undefined) {
      this.push(this.reg)

      this.reg = undefined
    } else {
      if (this.elements.length == 0) throw new Error("Stack is empty.")

      this.reg = this.pop()
    }

    return this
  }

  clear() {
    this.elements = []
  }

  slice(size: number): Type[] {
    var result: Type[] = []

    if (size > this.elements.length) throw new Error("Not enough items.")

    result = result.concat(this.elements.slice(-size))

    this.elements = this.elements.slice(0, -size)

    return result
  }

  from(arr: Type[]) {
    this.elements = arr

    return this
  }

  insert(arr: Type[]) {
    this.elements = [...this.elements, ...arr]

    return this
  }

  content() {
    return this.elements
  }

  right() {
    if (this.pointer < this.length) this.pointer++

    return this.elements[this.pointer]
  }

  left() {
    if (this.pointer > 0) this.pointer--

    return this.elements[this.pointer]
  }

  get length() {
    return this.elements.length
  }
}

export default Stack