const Nightmare = require('nightmare');

var dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
startDate = new Date("2021-01-01");
endDate = new Date("2021-01-13");

const nightmare = Nightmare({show:false});

var dates = [];
for(let nextDate = startDate; nextDate < endDate; nextDate.setDate(nextDate.getDate() + 1)){
    dates.push(nextDate.toLocaleDateString("de-CH", dateOptions));
}
console.log(dates);

dates.reduce(function(accumulator, date) {
  return accumulator.then(function(results) {
    console.log("processing... " + date);
    return nightmare
        .goto('https://www.ictax.admin.ch/extern/en.html#/ratelist/2021')
        .wait('#exchange_rate_currency')
        .select('#exchange_rate_currency','USD')
        .type('#exchange_rate_reference_date', '')
        .insert('#exchange_rate_reference_date', date)
        .wait(50)
        .evaluate(function () {
            return document.querySelector('#exchangeRates > div > div.panel-body > table > tbody > tr > td:nth-child(4)').innerHTML;
        })
        .then(function(result){
            results.push({"date": date, "value": result});
            return results;
        });
  });
}, Promise.resolve([])).then(function(results){
    console.dir(results);
    return nightmare.end();
})
.then(function() {
  console.log('done');
})
.catch(function(error){
  console.error('an error has occurred: ' + error);
});