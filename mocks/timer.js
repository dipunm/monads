export class Timer {
    constructor() {
        this.elapsed = 0;
    }
    start() {
        this.startDate = new Date();
    }

    end() {
        const endDate = new Date();
        this.elapsed = endDate - this.startDate;
    }

    running() {
        return !!this.startDate;
    }
}