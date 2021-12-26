const UNIT_LENGTH = 10
const WIDTH = 600
const HEIGHT = 600
const MAX_X = Math.floor(WIDTH / UNIT_LENGTH)
const MAX_Y = Math.floor(HEIGHT / UNIT_LENGTH)
const SNAKE_COLOR = '#0000FF'
const HEAD_COLOR = '#00FF00'
const FOOD_COLOR = '#FF0000'
const MINIMAL_FRAME_INTERVAL = 200

const CONTEXT = document.querySelector('#canvas').getContext('2d')


const INITIAL_STATE = {
    snake: [
        { x: 30, y: 30 },
        { x: 31, y: 30 },
        { x: 32, y: 30 }
    ],
    food: [
        { x: 10, y: 30 }
    ],
    direction: 'left',
    directionChanged: false
}

function collision(point, points) {
    return points.some(({ x, y }) => x === point.x && y === point.y)
}
function generateFood(occupied) {
    let x, y
    do {
        x = Math.floor(Math.random() * MAX_X)
        y = Math.floor(Math.random() * MAX_Y)
    } while (collision({ x, y }, occupied))
    return { x, y }
}

function nextState(state) {
    const { snake, food, direction } = state
    const [head, ...rest] = snake
    const newHead = { ...head }
    if (direction === 'left') {
        newHead.x -= 1
    } else if (direction === 'right') {
        newHead.x += 1
    } else if (direction === 'up') {
        newHead.y -= 1
    } else if (direction === 'down') {
        newHead.y += 1
    }
    const foodEatenIndex = food.findIndex(({ x, y }) => x === newHead.x && y === newHead.y)
    if (foodEatenIndex !== -1) {
        food.splice(foodEatenIndex, 1, generateFood([...food, ...snake, newHead]))
    } else {
        rest.pop()
    }
    return {
        snake: [newHead, head, ...rest],
        food,
        direction,
        directionChanged: false
    }
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

let previousTimestamp = 0
let state = INITIAL_STATE
function loop(timestamp) {
    if (timestamp - previousTimestamp > MINIMAL_FRAME_INTERVAL) {
        console.log(state)
        previousTimestamp = timestamp
        drawBoard(state)
        state = nextState(state)
    }
    window.requestAnimationFrame(loop)
}
function changeDirection(key) {
    const { direction, directionChanged } = state
    let newDirection = direction
    if (!directionChanged) {
        if (key === 'ArrowUp' && direction !== 'down') {
            newDirection = 'up'
        } else if (key === 'ArrowDown' && direction !== 'up') {
            newDirection = 'down'
        } else if (key === 'ArrowLeft' && direction !== 'right') {
            newDirection = 'left'
        } else if (key === 'ArrowRight' && direction !== 'left') {
            newDirection = 'right'
        }
    }
    state = {
        ...state,
        direction: newDirection,
        directionChanged: newDirection !== direction
    }
}
function directionListener(e) {
    changeDirection(e.key)
}

document
    .querySelector('#start')
    .addEventListener('click', function() {
        document.addEventListener('keydown', directionListener)
        window.requestAnimationFrame(loop)
        this.setAttribute('disabled', true)
    })
