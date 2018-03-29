/**
 * Records a log of historical values.
 * Each time we want to remember a value, we call .record
 */
class Historical {
    // private
    constructor(value, history) {
        this.value = value;
        this.history = history || [value];
    }

    static of(value) {
        return new Historical(value, [value]);
    }
    static record(value) {
        return this.of(value);
    }
    fmap(fn) {
        const newH = fn(this.value);
        // Bad Assumption: the largest history from both 
        // values should come first in the new composition.
        const largHistory = (
            newH.history.length > this.history.length ?
                newH.history : this.history);
        const smalHistory = (
            newH.history.length > this.history.length ?
                this.history : newH.history);

        return new Historical(newH.value, [...largHistory, ...smalHistory])

        // Fix: The order of histories should merge consistently regardless of size
    }
}

const A = Historical.record(30)
    .fmap(num => Historical.record(20))
    .fmap(num => Historical.record(num + 40));


const B_ = Historical.record(20)
            .fmap(num => Historical.record(num + 40));
const B = Historical.record(30)
            .fmap(num => B_);

console.log('A', A);
console.log('B', B);

/**
 * Output:
 * A Historical { value: 60, history: [ 30, 20, 60 ] }
 * B Historical { value: 60, history: [ 20, 60, 30 ] }
 */