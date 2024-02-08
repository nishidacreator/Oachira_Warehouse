function calculate(quantity, baseRate, discount){
    return ((((quantity * baseRate) - discount) * 18/100 ) + ((quantity * baseRate) - discount)).toFixed(2);
}

console.log(calculate(105.93, 48, 152.54));