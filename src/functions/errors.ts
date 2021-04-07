/**
 * A load of custom errors
 */

export class moveTypeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'moveTypeError';
    }
}

export class playerNullError extends Error {
    constructor(message) {
        super(message);
        this.name = 'playerNullError';
    }
}

export class IdError extends Error {
    constructor(message) {
        super(message);
        this.name = 'IdError';
    }
}