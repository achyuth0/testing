/* ============================================
   Modern Retro Snake Game - Main Logic
   ============================================ */

class SnakeGame {
    constructor() {
        // Canvas and context
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        // Game states
        this.gameState = 'menu'; // menu, playing, gameOver, paused
        this.difficulty = 'medium';
        this.difficulties = {
            easy: { speed: 5, name: 'Easy' },
            medium: { speed: 8, name: 'Medium' },
            hard: { speed: 12, name: 'Hard' }
        };

        // Game variables
        this.snake = [];
        this.food = {};
        this.score = 0;
        this.highScore = this.loadHighScore();
        this.foodEaten = 0;
        this.gameSpeed = this.difficulties[this.difficulty].speed;
        this.frameCount = 0;

        // Colors
        this.colors = {
            grid: 'rgba(0, 255, 0, 0.1)',
            snake: '#00ff00',
            snakeHead: '#00ffff',
            food: '#ff00ff',
            apple: '#ff0055'
        };

        // Input
        this.inputQueue = [];
        this.lastDirection = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };

        // UI elements
        this.screens = {
            menu: document.querySelector('.menu-screen'),
            game: document.querySelector('.game-screen-content'),
            gameOver: document.querySelector('.game-over-screen'),
            pause: document.querySelector('.pause-screen')
        };

        this.buttons = {
            start: document.getElementById('startBtn'),
            pause: document.getElementById('pauseBtn'),
            resume: document.getElementById('resumeBtn'),
            restart: document.getElementById('restartBtn'),
            menu: document.getElementById('menuBtn'),
            pauseMenu: document.getElementById('pauseMenuBtn'),
            difficulty: document.querySelectorAll('.difficulty-btn')
        };

        this.displays = {
            currentScore: document.getElementById('currentScore'),
            gameHighScore: document.getElementById('gameHighScore'),
            menuHighScore: document.getElementById('menuHighScore'),
            finalScore: document.getElementById('finalScore'),
            snakeLength: document.getElementById('snakeLength'),
            foodEaten: document.getElementById('foodEaten'),
            difficultyBadge: document.getElementById('difficultyBadge'),
            newHighScoreRow: document.getElementById('newHighScoreRow')
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateHighScoreDisplay();
        this.gameLoop();
    }

    setupEventListeners() {
        // Start button
        this.buttons.start.addEventListener('click', () => this.startGame());

        // Pause button
        this.buttons.pause.addEventListener('click', () => this.togglePause());
        this.buttons.resume.addEventListener('click', () => this.togglePause());

        // Restart button
        this.buttons.restart.addEventListener('click', () => this.startGame());

        // Menu buttons
        this.buttons.menu.addEventListener('click', () => this.showMenu());
        this.buttons.pauseMenu.addEventListener('click', () => this.showMenu());

        // Difficulty buttons
        this.buttons.difficulty.forEach(btn => {
            btn.addEventListener('click', (e) => this.setDifficulty(e.target.closest('.difficulty-btn')));
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    setDifficulty(btn) {
        this.buttons.difficulty.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.difficulty = btn.dataset.difficulty;
        this.gameSpeed = this.difficulties[this.difficulty].speed;
    }

    startGame() {
        this.reset();
        this.gameState = 'playing';
        this.showScreen('game');
    }

    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            this.showScreen('pause');
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            this.showScreen('game');
        }
    }

    showMenu() {
        this.gameState = 'menu';
        this.showScreen('menu');
    }

    showScreen(screenName) {
        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.remove('active');
        });
        this.screens[screenName].classList.add('active');
    }

    reset() {
        this.snake = [
            { x: 5, y: 10 },
            { x: 4, y: 10 },
            { x: 3, y: 10 }
        ];
        this.score = 0;
        this.foodEaten = 0;
        this.frameCount = 0;
        this.lastDirection = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.inputQueue = [];
        this.generateFood();
        this.updateScoreDisplay();
        this.displays.difficultyBadge.textContent = this.difficulties[this.difficulty].name;
    }

    generateFood() {
        let validPosition = false;
        let x, y;

        while (!validPosition) {
            x = Math.floor(Math.random() * this.tileCount);
            y = Math.floor(Math.random() * this.tileCount);

            validPosition = !this.snake.some(segment => segment.x === x && segment.y === y);
        }

        this.food = { x, y };
    }

    handleKeyPress(e) {
        const key = e.key.toLowerCase();
        const direction = this.getDirectionFromKey(key);

        if (direction) {
            e.preventDefault();
            this.nextDirection = direction;
        }
    }

    getDirectionFromKey(key) {
        const directionMap = {
            'arrowup': { x: 0, y: -1 },
            'arrowdown': { x: 0, y: 1 },
            'arrowleft': { x: -1, y: 0 },
            'arrowright': { x: 1, y: 0 },
            'w': { x: 0, y: -1 },
            's': { x: 0, y: 1 },
            'a': { x: -1, y: 0 },
            'd': { x: 1, y: 0 }
        };

        return directionMap[key] || null;
    }

    update() {
        if (this.gameState !== 'playing') return;

        this.frameCount++;

        if (this.frameCount % Math.floor(10 / (this.gameSpeed / 5)) === 0) {
            // Prevent 180-degree turns
            if (!(this.nextDirection.x === -this.lastDirection.x && this.nextDirection.y === -this.lastDirection.y)) {
                this.lastDirection = this.nextDirection;
            }

            // Move snake
            const head = { ...this.snake[0] };
            head.x += this.lastDirection.x;
            head.y += this.lastDirection.y;

            // Check wall collision
            if (this.checkWallCollision(head)) {
                this.endGame();
                return;
            }

            // Check self collision
            if (this.checkSelfCollision(head)) {
                this.endGame();
                return;
            }

            this.snake.unshift(head);

            // Check food collision
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10 * (this.difficulties[this.difficulty].speed / 5);
                this.foodEaten++;
                this.createParticles(this.food.x, this.food.y, 'food');
                this.generateFood();
            } else {
                this.snake.pop();
            }

            this.updateScoreDisplay();
        }
    }

    checkWallCollision(head) {
        return head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount;
    }

    checkSelfCollision(head) {
        return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
    }

    endGame() {
        this.gameState = 'gameOver';
        this.createParticles(this.snake[0].x, this.snake[0].y, 'explosion');
        this.showGameOverScreen();
    }

    showGameOverScreen() {
        this.displays.finalScore.textContent = Math.floor(this.score);
        this.displays.snakeLength.textContent = this.snake.length;
        this.displays.foodEaten.textContent = this.foodEaten;

        const isNewHighScore = Math.floor(this.score) > this.highScore;
        if (isNewHighScore) {
            this.highScore = Math.floor(this.score);
            this.saveHighScore();
            this.displays.newHighScoreRow.style.display = 'flex';
            this.createParticles(this.tileCount / 2, this.tileCount / 2, 'success');
        } else {
            this.displays.newHighScoreRow.style.display = 'none';
        }

        this.updateHighScoreDisplay();
        this.showScreen('gameOver');
    }

    updateScoreDisplay() {
        this.displays.currentScore.textContent = Math.floor(this.score);
    }

    updateHighScoreDisplay() {
        this.displays.menuHighScore.textContent = this.highScore;
        this.displays.gameHighScore.textContent = this.highScore;
    }

    saveHighScore() {
        localStorage.setItem('snakeHighScore', this.highScore.toString());
    }

    loadHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore') || '0', 10);
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = this.colors.grid;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw grid
        this.drawGrid();

        // Draw food
        this.drawFood();

        // Draw snake
        this.drawSnake();
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.05)';
        this.ctx.lineWidth = 0.5;

        for (let i = 0; i <= this.tileCount; i++) {
            const pos = i * this.gridSize;
            this.ctx.beginPath();
            this.ctx.moveTo(pos, 0);
            this.ctx.lineTo(pos, this.canvas.width);
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(0, pos);
            this.ctx.lineTo(this.canvas.width, pos);
            this.ctx.stroke();
        }
    }

    drawSnake() {
        this.snake.forEach((segment, index) => {
            const x = segment.x * this.gridSize;
            const y = segment.y * this.gridSize;

            if (index === 0) {
                // Draw head with glow
                this.ctx.fillStyle = this.colors.snakeHead;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = this.colors.snakeHead;
                this.ctx.fillRect(x + 2, y + 2, this.gridSize - 4, this.gridSize - 4);
                this.ctx.shadowBlur = 0;

                // Draw eyes
                const eyeSize = 2;
                this.ctx.fillStyle = '#000';
                this.ctx.fillRect(x + 6, y + 6, eyeSize, eyeSize);
                this.ctx.fillRect(x + this.gridSize - 8, y + 6, eyeSize, eyeSize);
            } else {
                // Draw body segments
                this.ctx.fillStyle = this.colors.snake;
                this.ctx.shadowBlur = 5;
                this.ctx.shadowColor = this.colors.snake;
                this.ctx.fillRect(x + 1, y + 1, this.gridSize - 2, this.gridSize - 2);
                this.ctx.shadowBlur = 0;
            }
        });
    }

    drawFood() {
        const x = this.food.x * this.gridSize;
        const y = this.food.y * this.gridSize;

        // Animated food
        const pulse = Math.sin(this.frameCount * 0.1) * 0.3 + 0.7;
        const size = this.gridSize * pulse;
        const offset = (this.gridSize - size) / 2;

        this.ctx.fillStyle = this.colors.apple;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.colors.apple;
        this.ctx.fillRect(x + offset, y + offset, size, size);
        this.ctx.shadowBlur = 0;
    }

    createParticles(x, y, type) {
        const particleCount = type === 'explosion' ? 20 : type === 'success' ? 30 : 5;
        const colors = type === 'explosion' ? ['#ff0055', '#ff00ff'] : type === 'success' ? ['#00ff00', '#00ffff'] : ['#ff00ff'];

        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = type === 'explosion' ? 2 + Math.random() * 3 : 1 + Math.random() * 2;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = type === 'explosion' ? 60 : type === 'success' ? 80 : 40;

            this.particles.push({
                x: x * this.gridSize + this.gridSize / 2,
                y: y * this.gridSize + this.gridSize / 2,
                vx,
                vy,
                color,
                life,
                maxLife: life,
                size: 3 + Math.random() * 3
            });
        }
    }

    gameLoop = () => {
        this.update();
        this.render();
        this.updateParticles();
        this.renderParticles();
        requestAnimationFrame(this.gameLoop);
    };

    // Particle system
    particles = [];

    updateParticles() {
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life--;
            return p.life > 0;
        });
    }

    renderParticles() {
        const container = document.querySelector('.particles-container');
        const existingParticles = container.querySelectorAll('.particle');

        if (existingParticles.length > 0) {
            existingParticles.forEach(p => p.remove());
        }

        this.particles.forEach(p => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = p.x + 'px';
            particle.style.top = p.y + 'px';
            particle.style.width = p.size + 'px';
            particle.style.height = p.size + 'px';
            particle.style.backgroundColor = p.color;
            particle.style.opacity = p.life / p.maxLife;
            particle.style.boxShadow = `0 0 ${p.size}px ${p.color}`;
            container.appendChild(particle);
        });
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
