import { Timer } from "../mocks/timer";

export const Tracker = {};

Tracker.Monad = class {
    constructor({
        count = 0,
        dateOfLastUpdated = undefined,
        completed = undefined,
        error,
        withTimer = false
    }, value) {
        this.state = {
            count,
            dateOfLastUpdated,
            completed,
            error
        };
        this.value = value;
        this.timeElapsed = 0;
        this.withTimer = withTimer;
    }

    async bind(fn) {
        const timer = this.withTimer ? new Timer() : undefined;
        if(timer) timer.start();
        let newMonad;
        if (this.noValue === true) {
            newMonad = new Tracker.Monad(Object.assign({}, 
                this.state, 
                {withTimer: this.withTimer}
            ));
            newMonad.noValue = true;
        } else {
            const newM = await fn(this.value);
            if (this.state.completed === false) {
                newMonad = new Tracker.Monad({
                    count: this.state.count,
                    dateOfLastUpdated: this.state.dateOfLastUpdated,
                    completed: false,
                    error: this.state.error,
                    withTimer: this.withTimer
                }, newM.value);
            }else {
                newMonad = new Tracker.Monad({
                    count: this.state.count + newM.state.count,
                    dateOfLastUpdated: newM.state.dateOfLastUpdated || this.state.dateOfLastUpdated,
                    completed: this.state.completed || newM.state.completed,
                    error: newM.state.error,
                    withTimer: this.withTimer
                }, newM.value);
            }
        }
        // This is a cheat, instead of having 2 types, I just use this property
        // to identify a no-value monad. 
        // I treat null and undefined as acceptable values to ensure I am not 
        // making a restrictive monad.
        if (newMonad.state.completed === true || newMonad.state.completed === false) { 
            newMonad.noValue = true
        };
        if(timer) {
            timer.end();
            newMonad.timeElapsed = this.timeElapsed + timer.elapsed;
            if(newMonad.noValue = true) {
                if (newMonad.timeElapsed) {
                    newMonad.state.timeElapsed = newMonad.timeElapsed;
                }
                newMonad.timeElapsed = 0;
                newMonad.withTimer = false;
            }
        }
        return newMonad;
    }

    getStatus() {
        return this.state;
    }
};

Tracker.Lift = function (value) {
    return new Tracker.Monad({}, value);
};
Tracker.RecordSuccess = function ({count, dateOfLastUpdated}) {
    return new Tracker.Monad({count, dateOfLastUpdated});
};
Tracker.Errored = function (err) {
    return new Tracker.Monad({ 
        error: err, 
        completed: false 
    });
};
Tracker.completeTimer = function () {
    return new Tracker.Monad({
        completed: true
    });
};

Tracker.startTimer = function () {
    return new Tracker.Monad({
        withTimer: true
    });
}

export async function runMonadic(func, ...args) {
    const it = await func(...args);
    async function cont(lastVal) {
        const { done, value: m } = await it.next(lastVal);
        return !done ? m.bind(cont) : m;
    }
    return await cont();
}