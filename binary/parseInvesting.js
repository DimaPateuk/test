const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const puppeteer = require('puppeteer');
var url = 'https://ru.investing.com/economic-calendar/';
const { time } = require('./utils');

module.exports = async function parseInvesting () {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    try {

        await page.click('#timeFrame_thisWeek');
        await new Promise(res => setTimeout(res, 3000));
        const html = await page.$eval('tbody[pageStartAt]', e => e.outerHTML);
        const body = JSDOM.fragment(html);
        var events = body.querySelectorAll('tr[data-event-datetime]')
        var mapEvents = {};
        events.forEach((item) => {
            const dateAttr = item.getAttribute('data-event-datetime');
            const timeStemp = +time(dateAttr);
            const importance = item.querySelectorAll('.sentiment .grayFullBullishIcon').length;
            //if (importance === 3) {
                if (!mapEvents[timeStemp]) {
                    mapEvents[timeStemp] = {
                        timeStemp,
                        events: []
                    };
                }
                mapEvents[timeStemp].events.push({
                    currency: item.querySelector('.flagCur').textContent,
                    importance: item.querySelectorAll('.sentiment .grayFullBullishIcon').length,
                    realTime: new Date(timeStemp)
                });
            //}
        });
        //console.log(mapEvents);
        return mapEvents;
    } catch (e) {
        console.log(e);
    }

    await browser.close();
};
