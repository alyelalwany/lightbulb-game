export class Timer {
  time;
  constructor(selector) {
    this.time = 0;
    // this.startCounter(selector);
  }

  getTime() {
    return this.time;
  }

  //   startCounter(selector) {
  //     let element = document.querySelector(selector);
  //     console.log(this.time);
  //     element.innerHTML = `Time elapsed : ${this.time} sec`;
  //     this.time += 1;
  //     setTimeout(this.startCounter, 1000, selector);
  //   }
}
