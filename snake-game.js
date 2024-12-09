class SnakeGame {
    constructor(boardSize = 20) {
        this.boardSize = boardSize;
        this.board = document.getElementById('game-board');
        this.snake = new Snake();
        this.food = this.generateFood();
        this.isRunning = true;
        this.init();
    }

    init() {
        this.createBoard();
        this.snake.draw(this.board);
        this.drawFood();
        this.listenForInput();
        this.startGame();
    }

    createBoard() {
        this.board.innerHTML = '';
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            this.board.appendChild(cell);
        }
    }

    generateFood() {
        let foodPosition;
        do {
            foodPosition = Math.floor(Math.random() * (this.boardSize * this.boardSize));
        } while (this.snake.body.includes(foodPosition));
        return foodPosition;
    }

    drawFood() {
        const cells = this.board.getElementsByClassName('cell');
        cells[this.food].classList.add('food');
    }

    clearFood() {
        const cells = this.board.getElementsByClassName('cell');
        Array.from(cells).forEach((cell) => {
            cell.classList.remove('food');
        });
    }

    listenForInput() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowUp') this.snake.changeDirection('UP');
            if (event.key === 'ArrowDown') this.snake.changeDirection('DOWN');
            if (event.key === 'ArrowLeft') this.snake.changeDirection('LEFT');
            if (event.key === 'ArrowRight') this.snake.changeDirection('RIGHT');
        });
    }

    startGame() {
        this.gameInterval = setInterval(() => {
            if (this.isRunning) {
                this.snake.move(this.food);
                this.checkCollision();
                this.snake.draw(this.board);
            }
        }, 200);
    }

    checkCollision() {
        const head = this.snake.body[0];
        const row = Math.floor(head / this.boardSize);
        const col = head % this.boardSize;

        // Check collision with walls
        if (row < 0 || row >= this.boardSize || col < 0 || col >= this.boardSize) {
            this.endGame();
        }

        // Check collision with self
        if (this.snake.body.slice(1).includes(head)) {
            this.endGame();
        }

        // Check if snake eats food
        if (head === this.food) {
            this.snake.grow();
            this.food = this.generateFood();
            this.clearFood();
            this.drawFood();
        }
    }

    endGame() {
        clearInterval(this.gameInterval);
        alert('Game Over!');
        this.isRunning = false;
    }
}

class Snake {
    constructor() {
        this.body = [42, 41, 40];
        this.direction = 'RIGHT';
    }

    changeDirection(newDirection) {
        if (newDirection === 'UP' && this.direction !== 'DOWN') this.direction = 'UP';
        if (newDirection === 'DOWN' && this.direction !== 'UP') this.direction = 'DOWN';
        if (newDirection === 'LEFT' && this.direction !== 'RIGHT') this.direction = 'LEFT';
        if (newDirection === 'RIGHT' && this.direction !== 'LEFT') this.direction = 'RIGHT';
    }

    move(foodPosition) {
        const head = this.body[0];
        let newHead;
        switch (this.direction) {
            case 'UP': newHead = head - 20; break;
            case 'DOWN': newHead = head + 20; break;
            case 'LEFT': newHead = head - 1; break;
            case 'RIGHT': newHead = head + 1; break;
        }

        // Add new head to the snake's body
        this.body.unshift(newHead);

        // If the snake eats the food, don't remove the tail
        if (newHead !== foodPosition) {
            this.body.pop();
        }
    }

    draw(board) {
        const cells = board.getElementsByClassName('cell');
        Array.from(cells).forEach((cell) => {
            cell.classList.remove('snake');
        });
        this.body.forEach((segment) => {
            cells[segment].classList.add('snake');
        });
    }

    grow() {
        // Snake grows by simply not removing the tail in the move method
    }
}

// Initialize the game
const game = new SnakeGame();
