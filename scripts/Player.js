import { images } from './assets.js';

export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 24;
        this.height = 32;
        this.vx = 0;
        this.vy = 0;
        this.speed = 3.8;
        this.jumpForce = -9.8;
        this.grounded = false;
        this.isCrouching = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.invulnerableTimer = 0;
        this.facing = 'right';
    }

    update(keys, gravity) {
        if (this.invulnerableTimer > 0) this.invulnerableTimer--;

        if (this.attackTimer > 0) {
            this.attackTimer--;
            if (this.attackTimer === 0) this.isAttacking = false;
        }

        this.isCrouching = (keys['KeyS'] || keys['ArrowDown']) && this.grounded;

        this.vx = 0;
        if (!this.isCrouching) {
            if (keys['KeyA'] || keys['ArrowLeft']) {
                this.vx = -this.speed;
                this.facing = 'left';
            }
            if (keys['KeyD'] || keys['ArrowRight']) {
                this.vx = this.speed;
                this.facing = 'right';
            }
        }

        if ((keys['KeyW'] || keys['ArrowUp'] || keys['Space']) && this.grounded && !this.isCrouching) {
            this.vy = this.jumpForce;
            this.grounded = false;
        }

        this.vy += gravity;
    }

    getAttackBox() {
        const whipRange = 36;
        return {
            x: this.facing === 'right' ? this.x + this.width : this.x - whipRange,
            y: this.y,
            width: whipRange,
            height: this.height
        };
    }

    draw(ctx) {
        if (this.invulnerableTimer % 4 >= 2) return; // Efeito piscar ao sofrer dano

        let pSprite = images.playerIdle;
        if (this.isAttacking) pSprite = images.playerAttack;
        else if (this.isCrouching) pSprite = images.playerCrouch;
        else if (!this.grounded) pSprite = this.vy < 0 ? images.playerJump : images.playerFall;
        else if (Math.abs(this.vx) > 0) pSprite = (Math.floor(Date.now() / 120) % 2 === 0) ? images.playerRun1 : images.playerRun2;

        ctx.save();
        if (this.facing === 'left') {
            ctx.translate(this.x + this.width, this.y);
            ctx.scale(-1, 1);
            ctx.drawImage(pSprite, 0, 0, this.width, this.height);
        } else {
            ctx.drawImage(pSprite, this.x, this.y, this.width, this.height);
        }
        ctx.restore();
    }
}