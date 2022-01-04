const { fromEvent, Scheduler, interval, operators: { scan } } = rxjs

const button = document.querySelector('#start')

const direction$ = fromEvent(document, 'keydown').subscribe(i => console.log(i))
const start$ = fromEvent(button, 'click').subscribe(i => console.log(i))

let tick$ = interval(MINIMAL_FRAME_INTERVAL, Scheduler.animationFrame)

const drawCircle = ({ x, y }) => {
  const radius = UNIT_LENGTH / 2
  const centerX = x * UNIT_LENGTH + radius
  const centerY = y * UNIT_LENGTH + radius
  CONTEXT.beginPath()
  CONTEXT.arc(centerX, centerY, radius, 0, 2 * Math.PI)
  CONTEXT.fill()
}
const drawSquare = ({ x, y }) => {
  CONTEXT.fillRect(x * UNIT_LENGTH, y * UNIT_LENGTH, UNIT_LENGTH, UNIT_LENGTH)
}
const drawShape = shape => {
  if (shape === 'circle') {
    return drawCircle
  } else if (shape === 'square') {
    return drawSquare
  }
}
const drawShapeWithColor = color => {
  CONTEXT.fillStyle = color // side effect, should move down the currying chain
  return drawShape
}
const drawSnakePart = isHead => drawShapeWithColor(isHead ? HEAD_COLOR : SNAKE_COLOR)('square')
const drawFood = coord => drawShapeWithColor(FOOD_COLOR)('circle')(coord)

function drawBoard(state) {
  CONTEXT.clearRect(0, 0, WIDTH, HEIGHT)
  const { snake, food } = state
  snake.forEach((part, index) => drawSnakePart(index === 0)(part))
  food.forEach(drawFood)
}

function nextState(state) {
  const { snake, food, direction, gameState } = state
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
  // const ranIntoBody = collision(newHead, snake)
  const withinBoard = newHead.x >= 0 && newHead.x < MAX_X && newHead.y >= 0 && newHead.y <MAX_Y
  const foodEatenIndex = food.findIndex(({ x, y }) => x === newHead.x && y === newHead.y)
  if (foodEatenIndex !== -1) {
    food.splice(foodEatenIndex, 1, generateFood([...food, ...snake, newHead]))
    // updateScore(POINTS_PER_FOOD)
  } else {
    rest.pop()
  }
  return {
    snake: [newHead, head, ...rest],
    food,
    direction,
    directionChanged: false,
    gameState
  }
}

function loop() {
  const state$ = tick$.pipe(
    scan(nextState, INITIAL_STATE)
  ).subscribe(drawBoard)
}

document
  .querySelector('#start')
  .addEventListener('click', function() {
    loop()
    this.setAttribute('disabled', true)
  })
