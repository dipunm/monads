import { Tracker } from './monad-stuff';
export class Cursor {
    constructor(cursor) {
        this.innerCursor = cursor;
        this.cached = [];
    }

    hasNext() {
        if (this.cached.length) return Promise.resolve(true);
        return this.innerCursor.fetchSome().then(some => {
            this.cached.push(...some);
            return this.cached.length > 0;
        });
    }

    _readNext(n) {
        if (this.cached.length >= n) {
            const toSend = this.cached.slice(0, n);
            this.cached = this.cached.slice(n);
            return Promise.resolve(toSend);
        }

        return this.innerCursor.fetchSome().then(some => {
            if (some.length) {
                this.cached.push(...some);
                return this._readNext(n);
            }

            // rest.
            const cached = this.cached;
            this.cached = [];
            return cached;
        });
    }
    readNext(n) {
        return this._readNext(n);
    }
}

export class MonadicCursor extends Cursor {
    constructor(cursor) {
        super(cursor);
    }

    readNext(n) {
        return super.readNext(n)
            .then(data => Tracker.from(data))
            .catch(err => Tracker.Errored(err));
    }
}