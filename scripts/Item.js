import { images } from './assets.js';

export class Item {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.collected = false;

        if (type === 'crate') {
            this.w = 28;
            this.h = 28;
            this.hp = 1;
        } else if (type === 'chest') {
            this.w = 30;
            this.h = 26;
            this.hp = 1;
        } else if (type === 'key') {
            this.w = 20;
            this.h = 20;
        } else if (type === 'potion') {
            this.w = 20;
            this.h = 20;
        } else { // 'coin'
            this.w = 18;
            this.h = 18;
        }
    }

    draw(ctx) {
        if (this.collected) return;

        let img = images.coin1;
        if (this.type === 'coin') {
            img = (Math.floor(Date.now() / 200) % 2 === 0) ? images.coin1 : images.coin2;
        } else if (this.type === 'key') {
            img = images.key;
        } else if (this.type === 'potion') {
            img = images.potion;
        } else if (this.type === 'crate') {
            img = images.crate;
        } else if (this.type === 'chest') {
            img = images.chest;
        }

        if (img && img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(img, this.x, this.y, this.w, this.h);
        } else {
            ctx.fillStyle = '#f1c40f';
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    }
}