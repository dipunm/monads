async function* myFunc(){ 
    x = yield 10;
    n = yield await Promise.resolve(20 + x);
    const y = yield 10 + x;
    return n * y + x + 50;
}

async function run(fn) {
    const it = fn();
    let val = undefined;
    let output = await it.next(val);
    val = output.value;
    while(!output.done) {
        output = await it.next(val);
        val = output.value;
    }
    return val;
}

run(myFunc).then(console.log);
