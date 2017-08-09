var page = require('webpage').create();
page.open('https://finance.yahoo.com/quote/PETR4.SA/history?p=PETR4.SA', function (status) {

    if (status === "success") {
        var content = page.content;
        try {
            var reCrumb = /"CrumbStore":{"crumb":"([a-zA-Z0-9\\]+)"}/;
            var match = reCrumb.exec(content);
            var crumb = match[1];
            console.log("Crumb", crumb);
            var url = "https://query1.finance.yahoo.com/v7/finance/download/PETR4.SA?period1=1499566256&period2=1502244656&interval=1d&events=history&crumb=" + crumb;
            console.log("Url", url);

            var fs = require('fs');

            var result = page.evaluate(function () {
                var out;
                $.ajax({
                    'async': false,
                    'url': url,
                    'success': function (data, status, xhr) {
                        out = data;
                    }
                });
                return out;
            });

            fs.write('mydownloadedfile.csv', result);
        } catch (exc) {
            phantom.exit();
        }
    }

    phantom.exit();


});