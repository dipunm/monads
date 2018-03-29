class Historical {
    // private
    constructor(value, history) {
        this.value = value;
        this.history = history || [value];
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

    static of(value) {
        return new Historical(value, [value]);
    }
}

const A = Historical.of(30)
    .fmap(num => 
        Historical.of(num == 30 ? 20 : num))
    .fmap(num => 
        Historical.of(num + 40));

const B = Historical.of(30)
    .fmap(num => 
        Historical.of(num == 30 ? 20 : num)
            .fmap(num => 
                Historical.of(num + 40)));

console.log('A', A);
console.log('B', B);

/**
 * Output:
 * A Historical { value: 60, history: [ 30, 20, 60 ] }
 * B Historical { value: 60, history: [ 20, 60, 30 ] }
 */