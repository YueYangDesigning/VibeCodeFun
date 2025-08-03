const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreDisplay');

let bird = {
    x: 50,
    y: 300,
    velocity: 0,
    gravity: 0.5,
    jump: -8
};

let pipes = [];
let score = 0;
let gameLoop;

// 游戏控制
function jump() {
    bird.velocity = bird.jump;
}

document.addEventListener('click', jump);

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') jump();
});

// 管道生成
function createPipe() {
    const gap = 150;
    const pipeWidth = 50;
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: canvas.width,
        topHeight: height,
        bottomY: height + gap,
        passed: false
    });
}

// 游戏循环
function update() {
    // 更新鸟的位置
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // 生成管道
    if (frames % 150 === 0) {
        createPipe();
    }

    // 更新管道位置和得分
    pipes.forEach(pipe => {
        pipe.x -= 2;
        
        // 得分检测
        if (!pipe.passed && pipe.x < bird.x) {
            score++;
            scoreElement.textContent = `得分: ${score}`;
            pipe.passed = true;
        }

        // 碰撞检测
        if (
            bird.x < pipe.x + 50 &&
            bird.x + 30 > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + 20 > pipe.bottomY)
        ) {
            gameOver();
        }
    });

    // 边界检测
    if (bird.y > canvas.height - 20 || bird.y < 0) {
        gameOver();
    }

    // 清除画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制元素
    ctx.fillStyle = 'yellow';
    ctx.fillRect(bird.x, bird.y, 30, 20);

    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 50, pipe.topHeight);
        ctx.fillRect(pipe.x, pipe.bottomY, 50, canvas.height - pipe.bottomY);
    });

    frames++;
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    alert(`游戏结束！最终得分: ${score}`);
    location.reload();
}

let frames = 0;
gameLoop = setInterval(update, 1000/60);