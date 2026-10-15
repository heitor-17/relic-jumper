import { images } from './assets.js';

export class UI {
    static drawAsset(ctx, img, x, y, w, h, fallbackColor = '#95a5a6') {
        if (img && img.complete && img.naturalWidth !== 0) {
            ctx.drawImage(img, x, y, w, h);
        } else {
            ctx.fillStyle = fallbackColor;
            ctx.fillRect(x, y, w, h);
        }
    }

    static drawHUD(ctx, gameState, levelName) {
        ctx.fillStyle = 'rgba(20, 25, 35, 0.75)';
        ctx.fillRect(10, 10, 260, 45);
        ctx.strokeStyle = '#34495e';
        ctx.strokeRect(10, 10, 260, 45);

        // Corações de vida
        for (let i = 0; i < 3; i++) {
            const heart = (i < gameState.lives) ? images.heartFull : images.heartEmpty;
            this.drawAsset(ctx, heart, 20 + (i * 26), 20, 22, 22, i < gameState.lives ? '#e74c3c' : '#7f8c8d');
        }

        // Contador de moedas
        this.drawAsset(ctx, images.uiCoin, 110, 20, 22, 22, '#f1c40f');
        ctx.fillStyle = '#f1c40f';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(`x${gameState.coins}`, 138, 36);

        // Ícone da Chave
        if (gameState.hasKey) {
            this.drawAsset(ctx, images.key, 190, 20, 22, 22, '#bdc3c7');
        }

        // Nome da Fase e Pontuação
        ctx.fillStyle = '#db06ea';
        ctx.font = '13px sans-serif';
        ctx.fillText(levelName, 580, 28);
        ctx.fillText(`Pontos: ${gameState.score}`, 580, 46);
    }

    static drawMenu(ctx, canvas, loadedAssets, totalAssets) {
        this.drawAsset(ctx, images.uiPanel, 200, 60, 400, 320, '#2c3e50');

        ctx.fillStyle = '#891818';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Relic Jumper', canvas.width / 2, 120);


        const progress = loadedAssets / totalAssets;
        this.drawAsset(ctx, images.barFrame, 280, 180, 240, 24, '#34495e');
        if (progress > 0) {
            this.drawAsset(ctx, images.barFill, 284, 184, (232 * progress), 16, '#e67e22');
        }

        const btnImg = (progress >= 1) ? images.btnPlay : images.btnPlayPress;
        this.drawAsset(ctx, btnImg, 320, 230, 160, 48, '#2ecc71');

        this.drawAsset(ctx, images.btnSettings, 220, 80, 28, 28, '#7f8c8d');
        this.drawAsset(ctx, images.btnClose, 550, 80, 28, 28, '#e74c3c');

        ctx.fillStyle = '#ffffff';
        ctx.font = '13px sans-serif';
        ctx.fillText(progress >= 1 ? 'Clica para Iniciar o Jogo' : 'A carregar ficheiros SVG...', canvas.width / 2, 310);
        ctx.textAlign = 'start';
    }

    static drawOverlayScreen(ctx, canvas, title, subtitle, sprite, color, gameState) {
        ctx.fillStyle = 'rgba(10, 15, 25, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.drawAsset(ctx, images.uiPanel, 220, 80, 360, 280, '#2c3e50');
        this.drawAsset(ctx, sprite, canvas.width / 2 - 20, 120, 40, 50, color);

        ctx.fillStyle = color;
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(title, canvas.width / 2, 210);

        ctx.fillStyle = '#ffffff';
        ctx.font = '15px sans-serif';
        ctx.fillText(subtitle, canvas.width / 2, 250);

        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#bdc3c7';
        ctx.fillText(`Pontuação Final: ${gameState.score} | Moedas: ${gameState.coins}`, canvas.width / 2, 280);
        ctx.textAlign = 'start';
    }
}