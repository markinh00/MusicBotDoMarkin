class AudioQueue {
    constructor() {
        this.queue = [];
        this.current = null;
        this.audioPLayer = null;
    }

    add(track) {
        this.queue.push(track);
    }

    next() {
        this.current = this.queue.shift();
        return this.current;
    }

    isEmpty() {
        return this.queue.length === 0;
    }

    clear() {
        this.queue = [];
        this.current = null;
        this.audioPLayer = null;
    }
}

module.exports = new AudioQueue();