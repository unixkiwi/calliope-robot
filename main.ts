let i = 0;

basic.forever(function () {
    basic.showNumber(i);
    
    if (i == 9) {
        i = 0;
    } else {
        i++;
    }
})