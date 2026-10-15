import { images, loadedAssets, totalAssets } from './assets.js';
import { LEVELS } from './levels.js';
import { Camera } from './Camera.js';
import { Player } from './Player.js';
import { Enemy } from './Enemy.js';
import { Item } from './Item.js';
import { UI } from './UI.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
const GRAVITY = 0.45;

const camera = new Camera(canvas.width, canvas.height);
const player = new Player(50, 100);

let currentScreen = 'MENU'; // 'MENU', 'PLAYING', 'GAMEOVER', 'VICTORY'
let currentLevelIndex = 0;

let activeTiles = [];
let activeEnemies = [];
let activeItems = [];
let activeDecorations = [];

let gameState = {
    score: 0,
    coins: 0,
    lives: 3,
    hasKey: false
};

const keys = {};
window.addEventListener('keydown', e => keys[e.code] = true);
window.addEventListener('keyup', e => keys[e.code] = false);

function loadLevel(index) {
    currentLevelIndex = index;
    const levelData = LEVELS[index].map;
    activeTiles = [];
    activeEnemies = [];
    activeItems = [];
    activeDecorations = [];
    gameState.hasKey = false;

    player.x = 50;
    player.y = 100;
    player.vx = 0;
    player.vy = 0;

    for (let r = 0; r < levelData.length; r++) {
        for (let c = 0; c < levelData[r].length; c++) {
            const char = levelData[r][c];
            const x = c * TILE_SIZE;
            const y = r * TILE_SIZE;

            if (char === '1') activeTiles.push({ x, y, type: 'grass', solid: true });
            else if (char === '2') activeTiles.push({ x, y, type: 'dirt', solid: true });
            else if (char === '3') activeTiles.push({ x, y, type: 'platform', solid: true });
            else if (char === '4') activeTiles.push({ x, y, type: 'stone', solid: true });
            else if (char === '5') activeTiles.push({ x, y, type: 'spikes', solid: false });
            else if (char === 'T') activeDecorations.push({ x, y, type: 'torch' });
            else if (char === 'S') activeDecorations.push({ x, y, type: 'sign' });
            else if (char === 'D') activeTiles.push({ x, y: y - TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE * 2, type: 'door', solid: false });
            else if (char === 'K') activeItems.push(new Item(x, y, 'key'));
            else if (char === 'o') activeItems.push(new Item(x, y, 'coin'));
            else if (char === 'P') activeItems.push(new Item(x, y, 'potion'));
            else if (char === 'C') activeItems.push(new Item(x, y, 'crate'));
            else if (char === 'B') activeItems.push(new Item(x, y, 'chest'));
            else if (char === 'e') activeEnemies.push(new Enemy(x, y, 'slime', x - 60, x + 60));
            else if (char === 'b') activeEnemies.push(new Enemy(x, y, 'bat'));
            else if (char === 'k') activeEnemies.push(new Enemy(x, y, 'skeleton', x - 80, x + 80));
        }
    }
}

function restartAll() {
    gameState.score = 0;
    gameState.coins = 0;
    gameState.lives = 3;
    loadLevel(0);
    currentScreen = 'PLAYING';
}

function update() {
    if (currentScreen !== 'PLAYING') return;

    player.update(keys, GRAVITY);

    if ((keys['KeyJ'] || keys['KeyZ']) && !player.isAttacking) {
        player.isAttacking = true;
        player.attackTimer = 18;
        processAttack();
    }

    player.x += player.vx;
    checkHorizontalCollisions();

    player.y += player.vy;
    player.grounded = false;
    checkVerticalCollisions();

    activeEnemies.forEach(e => {
        e.update(player.x);
        if (checkAABB(player, e)) {
            takeDamage();
        }
    });

    activeItems.forEach(item => {
        if (item.collected) return;
        if (checkAABB(player, { x: item.x, y: item.y, width: item.w, height: item.h })) {
            if (item.type === 'coin') {
                item.collected = true;
                gameState.coins++;
                gameState.score += 50;
            } else if (item.type === 'key') {
                item.collected = true;
                gameState.hasKey = true;
                gameState.score += 200;
            } else if (item.type === 'potion') {
                item.collected = true;
                if (gameState.lives < 3) gameState.lives++;
                gameState.score += 100;
            }
        }
    });

    const mapW = LEVELS[currentLevelIndex].map[0].length * TILE_SIZE;
    const mapH = LEVELS[currentLevelIndex].map.length * TILE_SIZE;
    camera.update(player.x, player.y, player.width, player.height, mapW, mapH);

    if (player.y > mapH + 50) {
        takeDamage(true);
    }
}

function processAttack() {
    const attackBox = player.getAttackBox();

    activeEnemies.forEach((e, index) => {
        if (checkAABB(attackBox, { x: e.x, y: e.y, width: e.w, height: e.h })) {
            e.hp--;
            if (e.hp <= 0) {
                activeEnemies.splice(index, 1);
                gameState.score += 150;
                activeItems.push(new Item(e.x, e.y, 'coin'));
            }
        }
    });

    activeItems.forEach(item => {
        if (item.collected) return;
        if (item.type === 'crate' || item.type === 'chest') {
            if (checkAABB(attackBox, { x: item.x, y: item.y, width: item.w, height: item.h })) {
                item.collected = true;
                gameState.score += 100;
                if (item.type === 'chest') {
                    gameState.coins += 5;
                    activeItems.push(new Item(item.x + 10, item.y - 10, 'potion'));
                } else {
                    activeItems.push(new Item(item.x, item.y, 'coin'));
                }
            }
        }
    });
}

function takeDamage(instantKill = false) {
    if (player.invulnerableTimer > 0 && !instantKill) return;

    gameState.lives = instantKill ? 0 : gameState.lives - 1;
    player.invulnerableTimer = 60;

    if (gameState.lives <= 0) {
        currentScreen = 'GAMEOVER';
    } else {
        player.x = 50;
        player.y = 100;
        player.vx = 0;
        player.vy = 0;
    }
}

function checkAABB(a, b) {
    return a.x < b.x + (b.width || b.w) &&
           a.x + (a.width || a.w) > b.x &&
           a.y < b.y + (b.height || b.h) &&
           a.y + (a.height || a.h) > b.y;
}

function checkHorizontalCollisions() {
    activeTiles.forEach(tile => {
        if (!tile.solid) return;
        const box = { x: tile.x, y: tile.y, width: TILE_SIZE, height: TILE_SIZE };
        if (checkAABB(player, box)) {
            if (player.vx > 0) player.x = box.x - player.width;
            if (player.vx < 0) player.x = box.x + box.width;
        }
    });
}

function checkVerticalCollisions() {
    activeTiles.forEach(tile => {
        const box = { x: tile.x, y: tile.y, width: tile.width || TILE_SIZE, height: tile.height || TILE_SIZE };

        if (tile.solid && checkAABB(player, box)) {
            if (player.vy > 0) {
                player.y = box.y - player.height;
                player.vy = 0;
                player.grounded = true;
            } else if (player.vy < 0) {
                player.y = box.y + box.height;
                player.vy = 0;
            }
        } else if (tile.type === 'spikes' && checkAABB(player, { x: box.x + 4, y: box.y + 12, width: TILE_SIZE - 8, height: TILE_SIZE - 12 })) {
            takeDamage();
        } else if (tile.type === 'door' && checkAABB(player, box)) {
            if (gameState.hasKey) {
                if (currentLevelIndex < LEVELS.length - 1) {
                    loadLevel(currentLevelIndex + 1);
                } else {
                    currentScreen = 'VICTORY';
                }
            }
        }
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentScreen === 'MENU') {
        UI.drawMenu(ctx, canvas, loadedAssets, totalAssets);
        return;
    }

    if (images.bgMountains.complete) {
        const bgX = -(camera.x * 0.2) % canvas.width;
        ctx.drawImage(images.bgMountains, bgX, 0, canvas.width, canvas.height);
        ctx.drawImage(images.bgMountains, bgX + canvas.width, 0, canvas.width, canvas.height);
    } else {
        ctx.fillStyle = '#1a252f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save();
    ctx.translate(-Math.floor(camera.x), -Math.floor(camera.y));

    activeDecorations.forEach(dec => {
        const sprite = dec.type === 'torch' ? images.torch : images.sign;
        UI.drawAsset(ctx, sprite, dec.x, dec.y, TILE_SIZE, TILE_SIZE);
    });

    activeTiles.forEach(tile => {
        let img = images.tileGrass;
        if (tile.type === 'dirt') img = images.tileDirt;
        else if (tile.type === 'platform') img = images.tilePlatform;
        else if (tile.type === 'stone') img = images.tileStone;
        else if (tile.type === 'spikes') img = images.spikes;
        else if (tile.type === 'door') img = images.door;

        UI.drawAsset(ctx, img, tile.x, tile.y, tile.width || TILE_SIZE, tile.height || TILE_SIZE);
    });

    activeItems.forEach(item => item.draw(ctx));
    activeEnemies.forEach(e => e.draw(ctx, player.x));
    player.draw(ctx);

    ctx.restore();

    UI.drawHUD(ctx, gameState, LEVELS[currentLevelIndex].name);

    if (currentScreen === 'GAMEOVER') {
        UI.drawOverlayScreen(ctx, canvas, 'GAME OVER', 'Pressiona R para Reiniciar', images.playerDeath, '#e74c3c', gameState);
    } else if (currentScreen === 'VICTORY') {
        UI.drawOverlayScreen(ctx, canvas, 'VITÓRIA TOTAL!', 'Todos os níveis foram superados!', images.playerVictory, '#2ecc71', gameState);
    }
}

canvas.addEventListener('click', () => {
    if (currentScreen === 'MENU' && loadedAssets >= totalAssets) {
        restartAll();
    }
});

function gameLoop() {
    if (keys['KeyR'] && (currentScreen === 'GAMEOVER' || currentScreen === 'VICTORY')) {
        restartAll();
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();