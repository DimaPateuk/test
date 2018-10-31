var rp = require('request-promise');
const token = 'SjDhLATgHfjb4vv';

const WebSocket = require('ws');

function toStr (data) {
    return JSON.stringify(data);
}

class Application  {
    constructor (ws) {
        console.log('OPEN');
        this.onMessage = this.onMessage.bind(this);
        this.ws = ws;
        ws.on('message', this.onMessage);

        ws.send(toStr({
            authorize: token
        }));
    }


    proposal ({proposal}) {
        console.log('proposal');
        this.ws.send(toStr({
            buy: proposal.id,
            price: 1,
        }));
    }

    makeProposal () {
        this.ws.send(toStr({
            "proposal": 1,
            "amount": "1",
            "basis": "stake",
            "contract_type":"UPORDOWN",
            "currency": "USD",
            "duration": "3",
            "duration_unit": "m",
            "barrier": "+20",
            "barrier2": "-20",
            "symbol": "R_100"
        }));
    }

    buy ({buy}) {
        console.log('buy', buy.balance_after);
    }

    makeBuy () {
        this.makeProposal();
    }

    authorize ({authorize}) {
        console.log('authorize');

        this.account = authorize;

    }

    onMessage (msg) {
        var data = JSON.parse(msg);
        if (this[data.msg_type]) {
            this[data.msg_type](data);
        } else {
            console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!! unnown type !!!!!!!!!!!!!!');
            console.log(data);
        }
    }


    desctoy () {
        console.log('destroy application');
    }
}

let app;
let ws;
let bayerInterval;

function intervalFunc () {
    if(!app || !app.account) {
        return tryAfterOneSecond();
    }

    app.makeBuy();
}

function setIntervalFunction () {
    bayerInterval = setInterval(intervalFunc, 10000);
}

function tryAfterOneSecond () {
    console.log('try after a second');
    clearInterval(bayerInterval);
    setTimeout(setIntervalFunction, 1000)
}

intervalFunc();

function createConnection () {
    ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=15367');
    app && app.desctoy();
    app = null;
    ws.on('open', function open() {
        app = new Application(ws);

        // ws.send(JSON.stringify({ticks:'R_100'}));
    });


    ws.on('close', function close() {
        console.log('try to reconect');
        createConnection();
    });
}

createConnection();


