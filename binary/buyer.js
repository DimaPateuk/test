const path = require('path');
const registrator = require("./binaryApp");
const parseInvesting = require("./parseInvesting");
const { time, getYoutubeLikeToDisplay, tryAfterSomeTime } = require('./utils');

let count = 0;
class Buyer {
    constructor(data) {
        this.data = data;
        this.contractsInProgress = {};
        this.contractsDone = {};
        this.closestEvent = null;
    }

    startChecking() {
        this.currentTime = time();
        this.currentTimeStamp = +this.currentTime;
        this.count = 1;

        this.interval = setInterval(() => {
            this.currentTime = time();
            this.currentTimeStamp = +this.currentTime;
            registrator.regestrBuy(count++, { value: 'test' + count }, this.currentTimeStamp);

            // if (--this.count === 0) {
            //     clearInterval(this.interval);
            // }

        }, 15000);
    }

    async parseInvesting() {
        //const data = await parseInvesting();
        //this.data = data;
    }

    restart () {
        appenedAsync(path.resolve(__dirname, './log'), `restart!!!!!\n${+time()}\n\n\n`);
        clearInterval(this.interval);
        this.start();
    }

    async start() {
        this.startTime = time();

        try {
            await this.parseInvesting();
            this.startChecking();
        } catch (e) {
            console.log(e);
            tryAfterSomeTime(() => this.start());
        }
    }
}

new Buyer().start();

// module.exports = Buyer;
