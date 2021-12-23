const UNIT_LENGTH = 10
const WIDTH = 600
const HEIGHT = 600
const SNAKE_COLOR = '#0000FF'
const HEAD_COLOR = '#00FF00'
const FOOD_COLOR = '#FF0000'

const CONTEXT = document.querySelector('#canvas').getContext('2d')


const INITIAL_STATE = {
    snake: [
        { x: 30, y: 30 },
        { x: 31, y: 30 },
        { x: 32, y: 30 }
    ],
    food: [
        { x: 40, y: 50 }
    ]
}

function drawSnakePart(coord, isHead) {
    const { x, y } = coord
    CONTEXT.fillStyle = isHead ? HEAD_COLOR : SNAKE_COLOR
    CONTEXT.fillRect(x * UNIT_LENGTH, y * UNIT_LENGTH, UNIT_LENGTH, UNIT_LENGTH)
}
function drawHead(coord) {
    drawSnakePart(coord, true)
}
function drawBody(coord) {
    drawSnakePart(coord, false)
}
function drawFood(coord) {
    const { x, y } = coord
    const radius = UNIT_LENGTH / 2
    const centerX = x * UNIT_LENGTH + radius
    const centerY = y * UNIT_LENGTH + radius
    CONTEXT.fillStyle = FOOD_COLOR
    CONTEXT.beginPath()
    CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    CONTEXT.fill()
}

function drawBoard(state) {
    CONTEXT.clearRect(0, 0, WIDTH, HEIGHT)
    const { snake, food } = state
    food.forEach(drawFood)
    const [head, ...body] = snake
    drawHead(head)
    body.map(drawBody)
}

drawBoard(INITIAL_STATE)
