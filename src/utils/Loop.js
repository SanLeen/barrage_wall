export default class Loop {
    timer;
    intervalTime = 350;

    constructor(intervalTime) {
        this.intervalTime = intervalTime ? intervalTime : this.intervalTime;
    }

    run(callback) {
        this.destroy();
        this.timer = window.setInterval(callback, this.intervalTime);
    }

    destroy() {
        if (this.timer) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }
}
