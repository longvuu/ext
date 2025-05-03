load('config.js');
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let list = [];
        // Select all chapter links in both mobile and desktop lists
        doc.select('.chapter-list a').forEach(function(a) {
            list.push({
                name: a.text(),
                url: a.attr('href'),
                host: BASE_URL
            });
        });
        return Response.success(list);
    }
    return null;
}