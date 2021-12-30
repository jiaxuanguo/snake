const UNIT_LENGTH = 20
const WIDTH = 600
const HEIGHT = 600
const MAX_X = Math.floor(WIDTH / UNIT_LENGTH)
const MAX_Y = Math.floor(HEIGHT / UNIT_LENGTH)
const SNAKE_COLOR = '#0000FF'
const HEAD_COLOR = '#00FF00'
const FOOD_COLOR = '#FF0000'
const MINIMAL_FRAME_INTERVAL = 200
const POINTS_PER_FOOD = 10
const HEAD_INITIAL_X = Math.floor(MAX_X / 2)
const HEAD_INITIAL_Y = Math.floor(MAX_Y / 2)
const CONTEXT = document.querySelector('#canvas').getContext('2d')
const INITIAL_STATE = {
  snake: [
    { x: HEAD_INITIAL_X, y: HEAD_INITIAL_Y },
    { x: HEAD_INITIAL_X + 1, y: HEAD_INITIAL_Y },
    { x: HEAD_INITIAL_X + 2, y: HEAD_INITIAL_Y }
  ],
  food: [
    { x: Math.max(0, HEAD_INITIAL_X - 5), y: HEAD_INITIAL_Y }
  ],
  direction: 'left',
  directionChanged: false,
  gameState: 'ongoing'
}
