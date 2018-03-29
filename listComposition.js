
function solve(x){ return [x, x]; }
function root(x) { return [-x, x]; }
function primes(x) { 
    const size = Math.random() * x;
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
    const sols = solve(x);
    for(var j = 0; j < sols.length; j++) {
        const roots = root(sols[j]);
        for(var k = 0; k < roots.length; k++) {
            const ps = primes(roots[k]);
            ans.push(...ps);
        }
    }
}