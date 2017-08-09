var request = require('request');

request('https://finance.yahoo.com/quote/PETR4.SA/history?p=PETR4.SA', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    var body = response.body;

    var fs = require('fs');

    // We need the crumb and cookies from first request
    var reCrumb = /"CrumbStore":{"crumb":"([a-zA-Z0-9\\]+)"}/;
    var match = reCrumb.exec(body);
    var crumb = match[1];
    console.log("Crumb", crumb);

    // Preparing cookie
    var headers = {
        'Cookie': response.headers['set-cookie'][0]
    };

    // TODO GENERALIZE TO OTHERS ASSETS
    var options = {
        url: "https://query1.finance.yahoo.com/v7/finance/download/PETR4.SA?period1=1167620400&period2=1502244656&interval=1d&events=history&crumb=" + crumb,
        method: 'GET',
        headers: headers
    };

    // Download the quotation
    request(options, function (error, response, body) {
        if (error) {
            console.error(error);
        } else {
            var fs = require('fs');
            fs.writeFile("quotation.csv", response.body, function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        }
    });
});