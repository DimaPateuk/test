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
        this.resetClosestEventInterval = setInterval(() => {
            this.closestEvent = null;

            const currentTime = time();
            const currentTimeStamp = +currentTime;

            console.log(`time to closest event: ${getYoutubeLikeToDisplay(10 * 60 * 1000 - (currentTimeStamp - this.currentTimeStamp))}`);

        }, 10000);
        this.currentTime = time();
        this.currentTimeStamp = +this.currentTime;
        registrator.regestrBuy(count++, { value: 'test' }, this.currentTimeStamp);
        this.interval = setInterval(() => {
            this.currentTime = time();
            this.currentTimeStamp = +this.currentTime;
            registrator.regestrBuy(count++, { value: 'test' }, this.currentTimeStamp);



            // const keys = Object.keys(this.data);
            // const currentTime = time();
            // const currentTimeStamp = +currentTime;

            // keys.forEach(key => {
            //     if (this.contractsInProgress[key] || this.contractsDone[key]) {
            //         return;
            //     }

            //     const timeStemp = parseInt(key, 10);
            //     const diff = currentTimeStamp - timeStemp;
            //     if (diff <= 0 && !this.closestEvent) {
            //         this.closestEvent = this.data[key];
            //         // console.log(`currentTime: ${currentTime}`);
            //         console.log(`time to closest event: ${getYoutubeLikeToDisplay(-1*diff)}`);
            //         // console.log(this.closestEvent);
            //     }

            //     if (diff > -50 && diff < 300) {
            //         this.contractsInProgress[key] = {};
            //         registrator.regestrBuy(key, this.data[key], currentTimeStamp);
            //     }

            // });


        }, 10 * 60 * 1000);
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
