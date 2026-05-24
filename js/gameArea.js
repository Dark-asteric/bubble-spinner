import { Bubble } from './bubble.js';

export class GameArea {

  bubblesCounter;

  constructor() {
    this.bubblesCounter = 0;
    this.area = document.querySelector('.game-area')
    this.score = 0
    this.scoreElement = document.getElementById('score')
    this.timeElement = document.getElementById('time')
    this.initialTime = parseInt(this.timeElement?.textContent || '30', 10)
    this.timeLeft = this.initialTime
    this._timerId = null
    this._spawnTimeoutId = null
    this._started = false
    this._finished = false
    // spawn rate (ms)
    this.spawnRateMin = 500
    this.spawnRateMax = 1500
    // how fast the spawn rate accelerates (0..1)
    this.acceleration = 0.6
  }

  /**
   * Crée et fait apparaître un nouvel élément bulle dans la zone prédéfinie.
   * Chaque bulle se voit attribuer un identifiant unique.
   *
   * @return {void} Cette méthode ne retourne aucune valeur.
   */
  spawnBubble(size = null) {
    // create a new bubble (optionally with explicit size), assign an id and append it to the area
    this.bubblesCounter += 1;
    const bubble = new Bubble(this.area, this.refresh.bind(this), this.handleBubbleClick.bind(this), size)
    bubble.id = this.bubblesCounter;
    if (bubble.element) bubble.element.dataset.id = String(bubble.id);
    this.area.appendChild(bubble.element);
    // console.log("spawn bubble.")
  }

  startGame() {
    if (this._started || this._finished) return;
    // clear any prior timers
    this.stopGame();
    this.timeLeft = this.initialTime;
    if (this.timeElement) this.timeElement.textContent = String(this.timeLeft);
    // start countdown
    this._timerId = setInterval(() => {
      this.timeLeft -= 1;
      if (this.timeElement) this.timeElement.textContent = String(this.timeLeft);
      if (this.timeLeft <= 0) this.stopGame();
    }, 1000);
    // mark started after timers are running
    this._started = true;
  }

  stopGame() {
    if (this._timerId) { clearInterval(this._timerId); this._timerId = null; }
    if (this._spawnTimeoutId) { clearTimeout(this._spawnTimeoutId); this._spawnTimeoutId = null; }
    this._started = false;
    if (this.timeLeft <= 0) {
      this._finished = true;
      const btn = document.getElementById('ajoutBubble');
      if (btn) btn.disabled = true;
      // show final score panel
      const finalPanel = document.getElementById('finalPanel');
      const finalScore = document.getElementById('finalScore');
      if (finalScore) finalScore.textContent = String(this.score);
      if (finalPanel) finalPanel.classList.remove('hidden');
    }
  }

  resetGame() {
    // hide final panel, re-enable add button, reset score and timer
    const finalPanel = document.getElementById('finalPanel');
    if (finalPanel) finalPanel.classList.add('hidden');
    const btn = document.getElementById('ajoutBubble');
    if (btn) { btn.disabled = false; }
    this._finished = false;
    this._started = false;
    // reset score and UI
    this.score = 0;
    if (this.scoreElement) this.scoreElement.textContent = String(this.score);
    this.timeLeft = this.initialTime;
    if (this.timeElement) this.timeElement.textContent = String(this.timeLeft);
    // clear any timers
    if (this._timerId) { clearInterval(this._timerId); this._timerId = null; }
    if (this._spawnTimeoutId) { clearTimeout(this._spawnTimeoutId); this._spawnTimeoutId = null; }
  }

  _scheduleNextSpawn() {
    if (this.timeLeft <= 0) return;
    // reduce delay as time passes so spawn rate increases
    const t = 1 - (this.timeLeft / this.initialTime); // 0..1
    const factor = Math.pow(t, this.acceleration);
    const min = this.spawnRateMin * (1 - 0.7 * factor);
    const max = this.spawnRateMax * (1 - 0.8 * factor);
    const delay = Math.max(120, Math.floor(Math.random() * (max - min) + min));
    this._spawnTimeoutId = setTimeout(() => {
      // spawn a random sized bubble
      const sizes = [15, 30, 45];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      this.spawnBubble(size);
      this._scheduleNextSpawn();
    }, delay);
  }

  refresh(bubble) {
    const el = bubble.element;
    // console.log(el)
  }
  handleBubbleClick(points) {
    // add earned points to score
    this.score += points;
    this.scoreElement.textContent = this.score;
  }
}
