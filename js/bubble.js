// bubble.js
export class Bubble {

  /**
   * Crée une nouvelle instance de Bulle.
   */
  constructor(area, refresh, click, size = null) {
    this.area = area;
    this.refresh = refresh
    this.click = click
    // choose radius among 15, 30, 45 for different point values
    const sizes = [15, 30, 45];
    this.radius = (size && sizes.includes(size)) ? size : sizes[Math.floor(Math.random() * sizes.length)];

    this.element = document.createElement('div')
    this.element.classList.add("bubble")

    const width = this.area.clientWidth;
    const height = this.area.clientHeight;
    this.position = this.getRandomPos(width, height, this.radius)

    // apply size and position
    this.element.style.width = `${this.radius * 2}px`;
    this.element.style.height = `${this.radius * 2}px`;
    this.element.style.left = `${this.position.x}px`;
    this.element.style.top = `${this.position.y}px`;
    this.element.style.cursor = 'pointer';
    this.element.style.transition = 'width 300ms ease, height 300ms ease';

    // record creation time to ignore any accidental immediate clicks
    this._createdAt = Date.now();

    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
      // ignore clicks that happen too quickly after creation (e.g., originating button click)
      if (Date.now() - this._createdAt < 50) return;
      const points = (this.radius === 15) ? 15 : (this.radius === 30 ? 10 : (this.radius === 45) ? 5 : 0);
      // clear the auto-remove timeout
      if (this._timeoutId) clearTimeout(this._timeoutId);
      // clear any growth timers
      if (this._growTimers && this._growTimers.length) this._growTimers.forEach(id => clearTimeout(id));
      // notify GameArea about the click (add score)
      if (typeof this.click === 'function') this.click(points);
      // remove the element from DOM
      if (this.element) this.element.remove();
      // allow GameArea to refresh or react
      if (typeof this.refresh === 'function') this.refresh(this);
    });

    // schedule growth steps and auto-remove after 3 seconds
    this._growTimers = [];
    // grow to medium after 800ms
    this._growTimers.push(setTimeout(() => this.setRadius(30), 800));
    // grow to large after 1600ms
    this._growTimers.push(setTimeout(() => this.setRadius(45), 1600));
    // remove after 3000ms
    this._timeoutId = setTimeout(() => {
      if (this.element) this.element.remove();
      if (typeof this.refresh === 'function') this.refresh(this);
    }, 3000);
  }

  setRadius(newRadius) {
    this.radius = newRadius;
    if (this.element) {
      this.element.style.width = `${this.radius * 2}px`;
      this.element.style.height = `${this.radius * 2}px`;
    }
  }

  getRandomPos(width,height,radius){
    const x = Math.random() * (width - 2 * radius) + radius;
    const y = Math.random() * (height - 2 * radius) + radius;
    return {x,y};
  }

}
