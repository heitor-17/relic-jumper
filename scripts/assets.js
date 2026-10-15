// Mapeamento integral dos 40 assets SVG do jogo
export const assetMap = {
    playerIdle: 'assets/asset-01.svg',
    playerRun1: 'assets/asset-02.svg',
    playerRun2: 'assets/asset-03.svg',
    playerJump: 'assets/asset-04.svg',
    playerFall: 'assets/asset-05.svg',
    playerCrouch: 'assets/asset-06.svg',
    playerAttack: 'assets/asset-07.svg',
    playerHurt: 'assets/asset-08.svg',
    playerVictory: 'assets/asset-09.svg',
    playerDeath: 'assets/asset-10.svg',

    tileGrass: 'assets/asset-11.svg',
    tileDirt: 'assets/asset-12.svg',
    tilePlatform: 'assets/asset-13.svg',
    tileStone: 'assets/asset-14.svg',
    spikes: 'assets/asset-15.svg',
    torch: 'assets/asset-16.svg',
    crate: 'assets/asset-17.svg',
    sign: 'assets/asset-18.svg',
    door: 'assets/asset-19.svg',
    bgMountains: 'assets/asset-20.svg',

    slimeIdle: 'assets/asset-21.svg',
    slimeAttack: 'assets/asset-22.svg',
    batOpen: 'assets/asset-23.svg',
    batClosed: 'assets/asset-24.svg',
    skeleton: 'assets/asset-25.svg',
    coin1: 'assets/asset-26.svg',
    coin2: 'assets/asset-27.svg',
    key: 'assets/asset-28.svg',
    potion: 'assets/asset-29.svg',
    chest: 'assets/asset-30.svg',

    heartFull: 'assets/asset-31.svg',
    heartEmpty: 'assets/asset-32.svg',
    uiCoin: 'assets/asset-33.svg',
    btnPlay: 'assets/asset-34.svg',
    btnPlayPress: 'assets/asset-35.svg',
    uiPanel: 'assets/asset-36.svg',
    btnClose: 'assets/asset-37.svg',
    btnSettings: 'assets/asset-38.svg',
    barFrame: 'assets/asset-39.svg',
    barFill: 'assets/asset-40.svg'
};

export const images = {};
export let loadedAssets = 0;
export const totalAssets = Object.keys(assetMap).length;

// Pré-carregamento assíncrono das imagens
for (let key in assetMap) {
    images[key] = new Image();
    images[key].onload = () => { loadedAssets++; };
    images[key].onerror = () => { loadedAssets++; }; // Continua mesmo sem rede
    images[key].src = assetMap[key];
}