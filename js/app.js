import {GameArea} from './gameArea.js';

const gameArea = new GameArea();
const area = document.querySelector('.game-area')

console.log(`Width : ${area.clientWidth} et Height : ${area.clientHeight}`)
// game starts when the user clicks the Add button
const btn = document.getElementById('ajoutBubble')

btn.addEventListener('click', () => {
    // always add a small bubble (radius 15)
    // start game on first click
    gameArea.startGame();
    gameArea.spawnBubble(15);
    // console.log("button clicked.")
})

const newBtn = document.getElementById('restartBtn');
if (newBtn) newBtn.addEventListener('click', () => {
    gameArea.resetGame();
});