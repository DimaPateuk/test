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

authorizeFlow.subscribe(
    ({authorize}) => {
        console.log('authorize');
        account = authorize;
    },
    e => console.log('authorizeFlow onError: %s', e),
    () => console.log('authorizeFlow onCompleted')
);

proposalWithBuyFlow.subscribe(
    ({proposal}) => {
        console.log('proposal', proposal.id)
        ws.send(toStr({
            buy: proposal.id,
            price: 1,
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
    }
    regestrBuy (key, eventData, currentTimeStamp) {
        console.log('regestrBuy', time());
        console.log(eventData);

        if(!canProcess()) {
            return tryAfterSomeTime(() => this.regestrBuy(key, eventData, +time()));
        }
        ws.send(toStr({
            "proposal": 1,
            "amount": "1",
            "basis": "stake",
            "contract_type":"UPORDOWN",
            "currency": "USD",
            "duration": "2",
            "duration_unit": "m",
            "barrier": "+1.65",
            "barrier2": "-1.65",
            "symbol": "R_10"
        }));
        // ws.send(toStr({
        //     "proposal": 1,
        //     "amount": "1",
        //     "basis": "multiplier",
        //     "contract_type": "LBHIGHLOW",
        //     "currency": "USD",
        //     "duration": "1",
        //     "duration_unit": "m",
        //     "symbol": "R_10"
        // }));



        this.watchContractmapMap[key] = buyFlow.subscribe(({buy}) => {
            const { contract_id } = buy;
            ws.send(toStr({
                "proposal_open_contract": 1,
                "contract_id": contract_id,
                "subscribe": 1
            }));
            this.watchContractmapMap[key].unsubscribe();
            this.watchContractmapMap[key] = null;
            this.watchContractmapMap[contract_id] = createProposalOpenContractFlow(contract_id)
                .subscribe(({proposal_open_contract}) => {
                    const { status } = proposal_open_contract;
                    if (status !== 'open') {
                        appenedAsync(path.resolve(__dirname, './proposal_open_contract'), toStr(proposal_open_contract));
                        console.log('              ', status, toStr(eventData));
                        appenedAsync(path.resolve(__dirname, './log'), `${status}\n${toStr(eventData)}\n${currentTimeStamp}\n${time()}\n\n\n`);
                        this.watchContractmapMap[contract_id].unsubscribe();
                        this.watchContractmapMap[contract_id] = null;
                    }
                });
        });
    }
}

module.exports = new Registrator();

