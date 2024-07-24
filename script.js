const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const shootSound = document.getElementById('shootSound');
const hitSound = document.getElementById('hitSound');
const backgroundMusic = document.getElementById('backgroundMusic');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let plane = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 60,
    width: 50,
    height: 30,
    speed: 5
};

let bullets = [];
let targets = [];
let score = 0;
let level = 1;
let targetCreationInterval = 2000; // milliseconds

function drawBackground() {
    let gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#000080'); // Xanh đậm
    gradient.addColorStop(1, '#87CEEB'); // Xanh nhạt
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlane() {
    ctx.fillStyle = '#00f'; // Màu xanh cho máy bay
    ctx.beginPath();
    ctx.moveTo(plane.x, plane.y + plane.height);
    ctx.lineTo(plane.x + plane.width / 2, plane.y);
    ctx.lineTo(plane.x + plane.width, plane.y + plane.height);
    ctx.closePath();
    ctx.fill();
    ctx.shadowColor = 'rgba(0, 0, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
}

function drawBullet(bullet) {
    ctx.fillStyle = '#f00'; // Màu đỏ cho đạn
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
    ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
    ctx.shadowBlur = 5;
}

function drawTarget(target) {
    ctx.fillStyle = '#0f0'; // Màu xanh lá cho mục tiêu
    ctx.fillRect(target.x, target.y, 30, 30);
    ctx.shadowColor = 'rgba(0, 255, 0, 0.5)';
    ctx.shadowBlur = 10;
}

function createTarget() {
    let x = Math.random() * (canvas.width - 30);
    let y = Math.random() * (canvas.height / 2);
    targets.push({ x: x, y: y });
}

function movePlane(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (plane.x > 0) plane.x -= plane.speed;
            break;
        case 'ArrowRight':
            if (plane.x < canvas.width - plane.width) plane.x += plane.speed;
            break;
        case 'ArrowUp':
            if (plane.y > 0) plane.y -= plane.speed;
            break;
        case 'ArrowDown':
            if (plane.y < canvas.height - plane.height) plane.y += plane.speed;
            break;
        case ' ':
            bullets.push({ x: plane.x + plane.width / 2 - 2.5, y: plane.y });
            shootSound.play();
            break;
    }
}

function updateBullets() {
    bullets = bullets.map(bullet => ({ x: bullet.x, y: bullet.y - 5 }));
    bullets = bullets.filter(bullet => bullet.y > 0);
}

function updateTargets() {
    targets = targets.map(target => ({ x: target.x, y: target.y + 1 }));
}

function checkCollision() {
    bullets.forEach((bullet, bulletIndex) => {
        targets.forEach((target, targetIndex) => {
            if (bullet.x < target.x + 30 &&
                bullet.x + 5 > target.x &&
                bullet.y < target.y + 30 &&
                bullet.y + 10 > target.y) {
                targets.splice(targetIndex, 1);
                bullets.splice(bulletIndex, 1);
                score += 10;
                hitSound.play();
                createExplosionEffect(target.x + 15, target.y + 15); // Tạo hiệu ứng nổ
                if (score % 100 === 0) {
                    level++;
                    targetCreationInterval = Math.max(500, targetCreationInterval - 200);
                    document.getElementById('level').innerText = `Cấp Độ: ${level}`;
                }
            }
        });
    });
}

function createExplosionEffect(x, y) {
    let explosionRadius = 20;
    let explosionColor = '#ff0';
    ctx.beginPath();
    ctx.arc(x, y, explosionRadius, 0, 2 * Math.PI);
    ctx.fillStyle = explosionColor;
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
}

function draw() {
    drawBackground();
    drawPlane();
    bullets.forEach(drawBullet);
    targets.forEach(drawTarget);
    document.getElementById('score').innerText = `Điểm: ${score}`;
}

function gameLoop() {
    updateBullets();
    updateTargets();
    checkCollision();
    draw();
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', movePlane);

setInterval(createTarget, targetCreationInterval);
backgroundMusic.play();

gameLoop();
