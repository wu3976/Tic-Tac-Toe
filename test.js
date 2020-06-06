let arr = [1, 2, 3, 2];
let temp = arr.reduce((a, b) => {
    return a + b;
})
console.log(typeof temp);