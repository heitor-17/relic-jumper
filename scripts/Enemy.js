import { images } from './assets.js';

export class Enemy {
    constructor(x, y, type, minX = 0, maxX = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.w = 26;
        this.h = (type === 'skeleton') ? 32 : 24;
        this.vx = (type === 'bat') ? 1.8 : 1.2;
        this.minX = minX;
        this.maxX = maxX;
        this.hp = (type === 'skeleton') ? 2 : 1;
        this.startY = y;
        this.angle = 0;
    }

    update(playerX) {
        if (this.type === 'slime' || this.type === 'skeleton') {
            this.x += this.vx;
            if (this.x < this.minX || this.x > this.maxX) this.vx *= -1;
        } else if (this.type === 'bat') {
            this.x += this.vx;
            if (this.x < playerX - 200 || this.x > playerX + 400) this.vx *= -1;
            this.angle += 0.08;
            this.y = this.startY + Math.sin(this.angle) * 20;
        }
    }

    draw(ctx, playerX) {
        let img = images.slimeIdle;
        if (this.type === 'slime') {
            img = (Math.abs(playerX - this.x) < 60) ? images.slimeAttack : images.slimeIdle;
        } else if (this.type === 'bat') {
            img = (Math.floor(Date.now() / 150) % 2 === 0) ? images.batOpen : images.batClosed;
        } else if (this.type === 'skeleton') {
            img = images.skeleton;
        }
        ctx.drawImage(img, this.x, this.y, this.w, this.h);
    }
}