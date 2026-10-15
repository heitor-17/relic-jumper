export class Camera {
    constructor(width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
    }

    update(targetX, targetY, targetW, targetH, mapWidth, mapHeight) {
        this.x = targetX - this.width / 2 + targetW / 2;
        this.y = targetY - this.height / 2 + targetH / 2;

        // Limita a câmera aos limites do mapa
        this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
        this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
    }
} 