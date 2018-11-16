const path = require('path');
var Rx = require('rxjs');
const { map, filter } = require('rxjs/operators')
const token = 'SjDhLATgHfjb4vv';
const {
    toStr,
    toJson,
    time,
    tryAfterSomeTime,
    appenedAsync,
} = require('./utils');

const WebSocket = require('ws');

var appSubject = new Rx.Subject();
let account;
let ws;
let count = 0;

const parseJson = map(toJson);

const jsonFlow = appSubject.pipe(parseJson, filter((data) => !data.error));
const jsonFlowError = appSubject.pipe(parseJson, filter((data) => data.error));

const proposalWithBuyFlow = jsonFlow.pipe(filter(data => data.msg_type === 'proposal'));
const buyFlow = jsonFlow.pipe(filter(data => data.msg_type === 'buy'));
const createProposalOpenContractFlow = (contract_id) => jsonFlow
    .pipe(filter(data => data.msg_type === 'proposal_open_contract' && data.echo_req.contract_id === contract_id));
const authorizeFlow = jsonFlow.pipe(filter(data => data.msg_type === 'authorize'));



const ticksHistoryFlow = jsonFlow.pipe(filter(data => data.history));
const ticksFlow = jsonFlow.pipe(filter(data => data.msg_type === 'tick'));


jsonFlowError.subscribe(
    (data) => {
        //console.log(data);
    }
);

authorizeFlow.subscribe(
    ({authorize}) => {
        //console.log('authorize');
        account = authorize;


        // ws.send(toStr({
        //     "ticks_history": "R_10",
        //     "end": "latest",
        //     "start": 1,
        //     "style": "candles",
        //     "adjust_start_time": 1,
        //     "count": 5000,
        //     "granularity": 120
        // }));
    }
);

proposalWithBuyFlow.subscribe(
    (data) => {
        const { proposal } = data;
        //console.log('proposal', proposal.id);
        ws.send(toStr({
            buy: proposal.id,
            price: proposal.ask_price,
        }));
    }
);


function createConnection () {
    ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=15367');

    ws.on('open', function open() {
        ws.on('message', (msg) => {
            appSubject.next(msg);
        });

        ws.send(toStr({
            authorize: token
        }));
    });


    ws.on('close', function close() {
        account = null;
        //console.log('try to reconect', time());
        createConnection();
    });

    ws.on('error', function error(e) {
        //console.log('error', time());
    });
}

createConnection();

function canProcess() {
    return ws && account;
}

class Registrator {
    constructor () {
        this.anaizingShown = false;

        this.regestrBuy = this.regestrBuy.bind(this);

        this.watchContractmapMap = {};
        this.total = 0;
        this.prices = [];
        this.prediction = 0;

        this.initialAmount = 1;
        this.bigAmount = this.initialAmount * 2;
        this.canSetBigAmount = true;
        this.currentAmount = this.initialAmount;

        this.l = 0;
        this.w = 0;

        this.ll = 0;
        this.ww = 0;

        this.statistic = {};


        for(var i = 0; i < 20; i++) {
            this.statistic[i] = 0;
        }


        ticksHistoryFlow.subscribe((data) => {
            this.prices = data.history.prices;
        })

        ticksFlow.subscribe((data) => {
            this.prices.push(data.tick.ask);
            this.stats = this.prices.reduce((res, item) => {
                const key = item.slice(-1);
                const count = res[key] || 0;
                res[key] = count + 1;
                return res;
            }, {});

            let prediction = 0;

            for(let i = 1; i < 10; i++) {
                if (this.stats[prediction] < this.stats[i]) {
                    this.prediction = i;
                }
            }

            this.prediction = prediction;

        });
    }

    getNumber () {
        if (!this.n) {
            this.n = 9;
            return 0;
        }

        return this.n--;
    }

    regestrBuy (key, eventData, currentTimeStamp) {
        if(!canProcess()) {
         //   return tryAfterSomeTime(() => this.regestrBuy(key, eventData, +time()));
            return;
        }
        //console.log(key, eventData);

        // if (this.w === 3) {
        //     if (!this.anaizingShown) {
        //         console.log('amaizing', this.total);
        //         this.anaizingShown = true;
        //     }

        //     return;

        //     console.log('amaizing', this.total);
        //     this.anaizingShown = true;
        //     this.w = 0;
        //     this.l = 0;
        //     this.currentAmount = this.initialAmount;
        // }

        if (this.stopActivity) return;

        if (this.w === 3) {
            console.log('amaizing', this.total);
            this.w = 0;
            this.l = 0;
            this.currentAmount = this.initialAmount;

            this.stopActivity = true;
            setTimeout(() => {
                this.stopActivity = false;
            }, 15 * 60 * 1000);
        }

        ws.send(toStr({
            "proposal": 1,
            "amount": this.currentAmount.toFixed(2),
            "basis": "stake",
            // "contract_type": "DIGITEVEN",
            // "contract_type": "DIGITODD",
            "contract_type": Math.random() > 0.5 ? "DIGITEVEN" : "DIGITODD",
            "currency": "USD",
            "duration": "5",
            "duration_unit": "t",
            "symbol": "R_100",
        }));


        this.watchContractmapMap[key] = buyFlow.subscribe((data) => {
            const { buy } = data;
            const { contract_id } = buy;

            if (this.watchContractmapMap[contract_id]) {
                return;
            }
            //console.log(buy);
            ws.send(toStr({
                "proposal_open_contract": 1,
                "contract_id": contract_id,
                "subscribe": 1
            }));
            this.watchContractmapMap[key].unsubscribe();
            this.watchContractmapMap[key] = null;

            this.watchContractmapMap[contract_id] = createProposalOpenContractFlow(contract_id)
                .subscribe((data) => {
                    const { proposal_open_contract } = data;
                    const { status, profit, sell_spot } = proposal_open_contract;

                    if (status !== 'open') {
                        this.profAsNumber = parseFloat(profit, 10);
                        if (this.profAsNumber > 0) {
                            this.w++;
                            this.ll = this.l < this.ll ? this.ll : this.l;
                            this.l = 0;
                            if (this.w === 1) {
                                this.currentAmount = this.profAsNumber;
                            } else {
                                this.currentAmount = this.currentAmount + this.profAsNumber;
                                //console.log('next bet', this.currentAmount);
                            }

                        } else {
                            this.ww = this.w < this.ww ? this.ww : this.w;
                            this.w = 0;
                            this.l++;
                            this.currentAmount = this.initialAmount;
                        }
                        this.total += this.profAsNumber;
                        //console.log('              ', this.total, profit);
                        this.watchContractmapMap[contract_id].unsubscribe();
                        this.watchContractmapMap[contract_id] = null;
                    }
                });
        });
    }
}

module.exports = new Registrator();
