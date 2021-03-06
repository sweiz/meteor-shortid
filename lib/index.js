'use strict';

// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1426452414093;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 5;

// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = 0;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function generate() {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + ShortId.encode(ShortId.alphabet.lookup, version);
    str = str + ShortId.encode(ShortId.alphabet.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + ShortId.encode(ShortId.alphabet.lookup, counter);
    }
    str = str + ShortId.encode(ShortId.alphabet.lookup, seconds);

    return str;
}


/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random ShortId.alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    ShortId.alphabet.seed(seedValue);
    return this.ShortId;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return this.ShortId;
}

/**
 *
 * sets new characters to use in the ShortId.alphabet
 * returns the shuffled ShortId.alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        ShortId.alphabet.characters(newCharacters);
    }

    return ShortId.alphabet.shuffled();
}


// Export all other functions as properties of the generate function
this.ShortId.generate = generate;
this.ShortId.seed = seed;
this.ShortId.worker = worker;
this.ShortId.characters = characters;
