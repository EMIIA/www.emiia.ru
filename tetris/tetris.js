const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 30;
const gridWidth = 10;
const gridHeight = 20;

canvas.width = gridWidth * gridSize;
canvas.height = gridHeight * gridSize;

const colors = [
  null,
  '#FF0D72', '#0DC2FF', '#0DFF72', '#F538FF', 
  '#FF8E0D', '#FFE138', '#3877FF'
];

const pieces = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]]  // L
];

let grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
let currentPiece, currentX, currentY;
let score = 0;
let gameOver = false;
let paused = false; // Добавлено состояние паузы

function newPiece() {
  const index = Math.floor(Math.random() * pieces.length);
  currentPiece = pieces[index];
  currentX = Math.floor(gridWidth / 2) - Math.floor(currentPiece[0].length / 2);
  currentY = 0;
  if (collides()) gameOver = true;
}

function collides(dx = 0, dy = 0, piece = currentPiece) {
  for (let y = 0; y < piece.length; y++) {
    for (let x = 0; x < piece[y].length; x++) {
      if (piece[y][x] && (
        currentY + y + dy >= gridHeight ||
        currentX + x + dx < 0 ||
        currentX + x + dx >= gridWidth ||
        grid[currentY + y + dy][currentX + x + dx]
      )) return true;
    }
  }
  return false;
}

function merge() {
  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x]) {
        grid[currentY + y][currentX + x] = pieces.indexOf(currentPiece) + 1;
      }
    }
  }
}

function clearLines() {
  let lines = 0;
  grid = grid.filter(row => {
    if (row.every(cell => cell)) {
      lines++;
      return false;
    }
    return true;
  });
  while (grid.length < gridHeight) {
    grid.unshift(Array(gridWidth).fill(0));
  }
  score += lines * 100;
}

function rotate() {
  const rotated = currentPiece[0].map((_, i) => currentPiece.map(row => row[i]).reverse());
  if (!collides(0, 0, rotated)) currentPiece = rotated;
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {
      if (grid[y][x]) {
        ctx.fillStyle = colors[grid[y][x]];
        ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
      }
    }
  }

  for (let y = 0; y < currentPiece.length; y++) {
    for (let x = 0; x < currentPiece[y].length; x++) {
      if (currentPiece[y][x]) {
        ctx.fillStyle = colors[pieces.indexOf(currentPiece) + 1];
        ctx.fillRect((currentX + x) * gridSize, (currentY + y) * gridSize, gridSize - 1, gridSize - 1);
      }
    }
  }

  // Добавляем прозрачный текст с инструкциями
  ctx.font = '20px Arial';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Прозрачность через rgba
  ctx.fillText('UP ARROW: ROTATE', 10, canvas.height - 100);
  ctx.fillText('DOWN ARROW: SOFT DROP', 10, canvas.height - 75);
  ctx.fillText('SPACEBAR: HARD DROP', 10, canvas.height - 50);
  ctx.fillText('ESC, P: PAUSE', 10, canvas.height - 25);

  // Отображение счета
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText(`Score: ${score}`, 10, 20);

  // Сообщение о паузе
  if (paused) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('PAUSED', canvas.width / 2 - 40, canvas.height / 2);
  }

  // Сообщение об окончании игры
  if (gameOver) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillText('GAME OVER', canvas.width / 2 - 50, canvas.height / 2);
  }
}

function drop() {
  if (!collides(0, 1)) {
    currentY++;
  } else {
    merge();
    clearLines();
    newPiece();
  }
}

function hardDrop() {
  while (!collides(0, 1)) {
    currentY++;
  }
  merge();
  clearLines();
  newPiece();
}

document.addEventListener('keydown', e => {
  if (gameOver || paused) {
    if (gameOver && e.key === 'Enter') {
      grid = Array(gridHeight).fill().map(() => Array(gridWidth).fill(0));
      score = 0;
      gameOver = false;
      newPiece();
    }
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      if (!collides(-1)) currentX--;
      break;
    case 'ArrowRight':
      if (!collides(1)) currentX++;
      break;
    case 'ArrowUp':
      rotate();
      break;
    case 'ArrowDown':
      drop();
      break;
    case ' ':
      hardDrop();
      break;
    case 'Escape':
    case 'p':
    case 'P':
      paused = !paused; // Переключение состояния паузы
      break;
  }
});

function update() {
  if (!gameOver && !paused) {
    drop();
  }
  draw();
  requestAnimationFrame(update);
}

newPiece();
update();
