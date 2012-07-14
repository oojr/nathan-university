//Interpreters and Compilers 

// Write a function prelude that takes a music expression 
// expr as input and returns an expression that means to play
// a d4 note for 500 milliseconds and then play expr.

var prelude = function(expr) {
    return { tag: 'seq', 
             left: { tag: 'note', pitch: 'd4', dur: 500 },
             right: expr };
};

//Abstract Syntax Trees

// This time write a function reverse that takes a music expression
// as input and returns a new music expression that plays the notes
// in the reverse order. Your function shouldn't modify the input,
// it should just return a new reversed expression.


var reverse = function(expr) {
    if(expr.tag === 'note') {
        return expr;
    }
    return {
        tag: 'seq',
        left: reverse(expr.right),
        right: reverse(expr.left)
    };
};

//Compiling Music

// Write a function endTime that takes a start time 
// time in milliseconds and a MUS expression expr.
// Assuming expr starts playing at time time, the 
// function should return the time when expr finishes.



var endTime = function (time, expr) {
    if (expr.tag === 'note') return time + expr.dur;
    var ltime = endTime(time, expr.left);
    return endTime(ltime, expr.right);
};

//Compiling Music for reals

//Write a function compile that compiles MUS 
//songs into NOTE songs.

var compileT = function (musexpr, time) {
    if (musexpr.tag === 'note') {
        return [ { tag: 'note', 
                  pitch: musexpr.pitch,
                  start: time,
                  dur: musexpr.dur } ];
    }
    var left = compileT(musexpr.left, time);
    var ldur = endTime(time, musexpr.left);
    var right = compileT(musexpr.right, ldur);
    return left.concat(right);
};
 
var compile = function (musexpr) {
    return compileT(musexpr, 0);
};

//Styles of Interpretation 

// Assuming you have compile and playNOTE implemented
// in JavaScript, implement playMUS in JavaScript.


var playMUS = function (musexpr) {
    return playNOTE(compile(musexpr));
};

//Parallel Composition

// Write a function compile that compiles MUS 
// songs that can contain 'par' into NOTE songs.


var endTime = function (time, expr) {
    if (expr.tag === 'note') return time + expr.dur;
    if (expr.tag === 'seq')
        return endTime(endTime(time, expr.left), expr.right);
    return Math.max(endTime(time, expr.left), endTime(time, expr.right));
};
 
var compileT = function (musexpr, time) {
    var left, ldur, right;
    if (musexpr.tag === 'note') {
        return [ { tag: 'note', 
                  pitch: musexpr.pitch,
                  start: time,
                  dur: musexpr.dur } ];
    }



    if (musexpr.tag === 'seq') {
        left = compileT(musexpr.left, time);
        ldur = endTime(time, musexpr.left);
        right = compileT(musexpr.right, ldur);
        return left.concat(right);
    }
    if (musexpr.tag === 'par') {
        left = compileT(musexpr.left, time);
        right = compileT(musexpr.right, time);
        return left.concat(right);
    }
};
 
var compile = function (musexpr) {
    return compileT(musexpr, 0);
};

//Test!

var melody_mus = 
    { tag: 'seq',
      left: 
       { tag: 'seq',
         left: { tag: 'note', pitch: 'a4', dur: 250 },
         right: { tag: 'note', pitch: 'b4', dur: 250 } },
      right:
       { tag: 'seq',
         left: { tag: 'note', pitch: 'c4', dur: 500 },
         right: { tag: 'note', pitch: 'd4', dur: 500 } } };

console.log(melody_mus);
console.log(compile(melody_mus));
