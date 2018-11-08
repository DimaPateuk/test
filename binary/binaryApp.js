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


const parseJson = map(toJson);

const jsonFlow = appSubject.pipe(parseJson);

const proposalWithBuyFlow = jsonFlow.pipe(filter(data => data.msg_type === 'proposal'));
const buyFlow = jsonFlow.pipe(filter(data => data.msg_type === 'buy'));
const createProposalOpenContractFlow = (contract_id) => jsonFlow
    .pipe(filter(data => data.msg_type === 'proposal_open_contract' && data.echo_req.contract_id === contract_id));
const authorizeFlow = jsonFlow.pipe(filter(data => data.msg_type === 'authorize'));

const ticksHistoryFlow = jsonFlow.pipe(filter(data => data.msg_type === 'candles'));

// ticksHistoryFlow.subscribe(
//     ({candles}) => {
//         var t = candles.reduce((res, item) => {
//             const {high, low} = item;

//             const result = (high - low) - 2.25;
//             if (result < 0) {
//                 res.minus +=result;
//             } else {
//                 res.plus +=result;
//             }

//             return res;
//         }, {
//             minus: 0,
//             plus: 0
//         });

//         console.log(t);
//     }
// );

authorizeFlow.subscribe(
    ({authorize}) => {
        console.log('authorize');
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
    },
    e => console.log('authorizeFlow onError: %s', e),
    () => console.log('authorizeFlow onCompleted')
);

proposalWithBuyFlow.subscribe(
    ({proposal}) => {
      console.log('proposal', proposal.id)
        ws.send(toStr({
            buy: proposal.id,
            price: proposal.ask_price,
        }));
    },
    e => console.log('proposalWithBuyFlow onError: %s', e),
    () => console.log('proposalWithBuyFlow onCompleted')
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
        console.log('try to reconect', time());
        createConnection();
    });

    ws.on('error', function error(e) {
        console.log('error', time());
    });
}

createConnection();

function canProcess() {
    return ws && account;
}

class Registrator {
    constructor () {
        this.regestrBuy = this.regestrBuy.bind(this);

        this.watchContractmapMap = {};
        this.total = 0;
    }
    regestrBuy (key, eventData, currentTimeStamp) {


        if(!canProcess()) {
            return tryAfterSomeTime(() => this.regestrBuy(key, eventData, +time()));
        }
        console.log('regestrBuy', time());
        console.log(eventData);

        ws.send(toStr({
          "proposal": 1,
          "amount": "1",
          "basis": "multiplier",
          "contract_type": "LBHIGHLOW",
          "currency": "USD",
          "duration": "5",
          "duration_unit": "m",
          "symbol": "R_10"
        }));

        this.watchContractmapMap[key] = buyFlow.subscribe((buy) => {
            const { contract_id } = buy;
            ws.send(toStr({
                "proposal_open_contract": 1,
                "contract_id": contract_id,
                "subscribe": 1
            }));
            this.watchContractmapMap[key].unsubscribe();
            this.watchContractmapMap[contract_id] = createProposalOpenContractFlow(contract_id)
                .subscribe(({proposal_open_contract}) => {
                    if (!proposal_open_contract) {
                        return;
                    }
                    const { status, profit } = proposal_open_contract;
                    console.log(profit);

                    if (status !== 'open') {
                        console.log('              ', profit);
                        this.total += parseFloat(profit, 10);
                        appenedAsync(path.resolve(__dirname, './log'), `${this.total}\n${toStr(proposal_open_contract)}\n\n\n`);
                        this.watchContractmapMap[contract_id].unsubscribe();
                    }
                });
        });
    }
}

module.exports = new Registrator();
