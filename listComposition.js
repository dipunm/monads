Array.prototype.flatmap = function (fn) {
    const arr2 = []
    for(var i = 0; i < this.length; i++) {
        arr2.push(...fn(this[i]));
    }
    return arr2;
}


function solve(x){ return [Math.random() * x, Math.random() * x]; }
function root(x) { return [-Math.random() * x, Math.random() * x]; }
function primes(x) { 
    const size = 5;
    const list = [];
    for(var i = 0; i < size; i ++) {
        list.push(i);
    }
    return list;
}


// solve x for K where K in [20000, 21000, 30000];
// then square root
// then find the primes.

const vals = [20000, 21000, 30000];
const ans = [];
for(var i = 0; i < vals.length; i++) {
    const sols = solve(vals[i]);
    for(var j = 0; j < sols.length; j++) {
        const roots = root(sols[j]);
        for(var k = 0; k < roots.length; k++) {
            const ps = primes(roots[k]);
            ans.push(...ps);
        }
    }
}
console.log('ans', ans.length);

const ans2 = vals
    .flatmap(solve)
    .flatmap(root)
    .flatmap(primes);
console.log('fmap', ans2.length);