var request = require('request');
var fs = require('fs');
var csv = require("fast-csv");

request('https://finance.yahoo.com/quote/PETR4.SA/history?p=PETR4.SA', function (error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

    // We need the crumb and cookies from first request
    var crumb = extractCrumb(response.body);
    // Preparing cookie
    var headers = {
        'Cookie': response.headers['set-cookie'][0]
    };

    var assetsPromise = getAssetList();

    assetsPromise.then(function (assets) {

        assets.forEach(function (asset) {
            var url = "https://query1.finance.yahoo.com/v7/finance/download/" + asset + ".SA?period1=1167620400&period2=1502244656&interval=1d&events=history&crumb=" + crumb;
            var options = {
                url: url,
                method: 'GET',
                headers: headers
            };

            // Download the quotation
            request(options, function (err, response, body) {
                if (err) {
                    console.error(err);
                } else {
                    if (response.statusCode == 404) {
                        console.log("Asset '" + asset + "' not found");
                    } else {
                        var fs = require('fs');
                        fs.writeFile("assets/" + asset + ".csv", response.body, function (err) {
                            if (err) {
                                console.log(err);
                            }
                            console.log("The file was saved!");
                        });
                    }
                }
            });



        });
    }).catch(function (err) {
        console.error("An error ocurred when reading csv of assets names.", err);
    });


});

function extractCrumb(body) {
    var reCrumb = /"CrumbStore":{"crumb":"([a-zA-Z0-9\\]+)"}/;
    var match = reCrumb.exec(body);
    var crumb = match[1];
    console.log("Crumb", crumb);
    return crumb;
}

function getAssetList() {
    return new Promise(function (resolve, reject) {
        try {
            var assets = [];
            csv.fromPath("assets.csv")
                .on("data", function (data) {
                    assets.push(data[0]);
                })
                .on("end", function () {
                    resolve(assets);
                });

        } catch (exc) {
            reject(exc);
        }
    });

}