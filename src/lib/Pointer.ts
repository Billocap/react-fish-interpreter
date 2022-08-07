enum Direction {
	RIGHT,
	DOWN,
	LEFT,
	UP
}

interface Position {
	x: number,
	y: number
}

class Pointer {
	private direction: Direction
	private position: Position
	private underwater: boolean

	constructor() {
		this.direction = Direction.RIGHT
		this.position = {
			x: 0,
			y: 0
		}
		this.underwater = false
	}

	left() {
		this.direction = (this.direction + 3) % 4
	}

	right() {
		this.direction = (this.direction + 1) % 4
	}

	flip() {
		this.direction = (this.direction + 2) % 4
	}

	turn(direction: Direction) {
		this.direction = direction % 4
	}

	jump(x: number, y: number) {
		this.position = {x, y}
	}

	slide(x: number, y: number) {
		this.position = {
			x: this.x + x,
			y: this.y + y
		}
	}

	skip(d: number) {
		this.position = {
			x: this.x + d * Math.trunc(Math.cos(this.direction * (Math.PI / 2))),
			y: this.y + d * Math.trunc(Math.sin(this.direction * (Math.PI / 2)))
		}
	}

	step() {
		this.position = {
			x: this.x + Math.trunc(Math.cos(this.direction * (Math.PI / 2))),
			y: this.y + Math.trunc(Math.sin(this.direction * (Math.PI / 2)))
		}
	}

	dive() {
		this.underwater = true
	}

	rise() {
		this.underwater = false
	}

	get x() {
		return this.position.x
	}

	get y() {
		return this.position.y
	}

	get dir() {
		return this.direction
	}

	get diving() {
		return this.underwater
	}
}

export default Pointer
export { Direction, type Position }