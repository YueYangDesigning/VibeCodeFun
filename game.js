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
        passed: false,
        imgIndex: Math.floor(Math.random() * assets.pipes.length)  // 随机选择图片索引
    });
}

// 游戏循环
// 资源加载
// 修改资源定义
const assets = {
    bird: new Image(),
    pipes: [],  // 改为数组存储多个管道图片
    bg: new Image()
};

// 自动加载pipes目录下所有图片
const pipeImages = ['pipe1.png', 'pipe2.png', 'pipe3.png'];
pipeImages.forEach(img => {
    const image = new Image();
    image.src = `assets/images/pipes/${img}`;
    assets.pipes.push(image);
});

// 修改管道对象结构
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

// 替换原有绘制逻辑
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

    // 绘制背景
    ctx.drawImage(assets.bg, 0, 0, canvas.width, canvas.height);
    
    // 绘制小鸟
    ctx.drawImage(assets.bird, bird.x, bird.y, 40, 30);
    
    // 绘制管道（带动态尺寸）
    pipes.forEach(pipe => {
        const img = assets.pipes[pipe.imgIndex];
        const scaleFactor = img.naturalHeight / pipe.topHeight;
        const scaledWidth = img.naturalWidth / scaleFactor;
        
        // 上管道
        ctx.drawImage(img, 
            pipe.x, 0, 
            scaledWidth, pipe.topHeight
        );
        
        // 下管道
        ctx.drawImage(img, 
            pipe.x, pipe.bottomY, 
            scaledWidth, canvas.height - pipe.bottomY
        );
    });
}

// 更新碰撞检测
function checkCollision(pipe) {
    const img = assets.pipes[pipe.imgIndex];
    const actualWidth = img.naturalWidth * (bird.y / pipe.topHeight);
    
    return (
        bird.x < pipe.x + actualWidth &&
        bird.x + 30 > pipe.x &&
        (bird.y < pipe.topHeight || bird.y + 20 > pipe.bottomY)
    );
}

// 添加音频控制
function startGame() {
    document.getElementById('bgm').play();
    gameLoop = setInterval(update, 1000/60);
}

function gameOver() {
    document.getElementById('bgm').pause();
    cancelAnimationFrame(gameLoop);
    alert(`游戏结束！最终得分: ${score}`);
    location.reload();
}

let frames = 0;
gameLoop = setInterval(update, 1000/60);