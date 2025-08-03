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
let frames = 0;

// 加载资源
const pipeImage = new Image();
pipeImage.src = 'assets/images/teacher1.png';

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
    const minHeight = 50;
    const maxHeight = canvas.height - gap - minHeight;
    const height = Math.random() * (maxHeight - minHeight) + minHeight;
    const width = Math.random() * 100 + 50; // 随机宽度 50-150

    pipes.push({
        x: canvas.width,
        topHeight: height,
        bottomY: height + gap,
        width: width, // 存储宽度
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
    frames++;

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
            bird.x < pipe.x + pipe.width &&
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

    // 绘制管道
    pipes.forEach(pipe => {
        // 上管道
        ctx.drawImage(pipeImage, pipe.x, 0, pipe.width, pipe.topHeight);
        // 下管道，需要翻转图片
        ctx.save();
        ctx.translate(pipe.x + pipe.width, pipe.bottomY + (canvas.height - pipe.bottomY));
        ctx.rotate(Math.PI);
        ctx.drawImage(pipeImage, 0, 0, pipe.width, canvas.height - pipe.bottomY);
        ctx.restore();
    });
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    alert(`游戏结束！最终得分: ${score}`);
    location.reload();
}

function gameStart() {
    gameLoop = requestAnimationFrame(function loop() {
        update();
        gameLoop = requestAnimationFrame(loop);
    });
}

gameStart();