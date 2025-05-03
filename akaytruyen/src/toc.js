load('config.js');

function execute(url) {
    let allChapters = [];
    let maxPage = 1;
    url = url.replace(/\?page=\d+/, '');
    if (url.indexOf("/truyen/con-duong-ba-chu") !== -1) {
        maxPage = 100;
    }
    for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
        let pageUrl = url + "?page=" + currentPage;
        let pageResponse = fetch(pageUrl);
        if (!pageResponse.ok) break;
        let pageDoc = pageResponse.html();
        const seen = new Set();
        pageDoc.select('.chapter-list a').forEach(e => {
            let name = e.select('.chapter-title').text().trim();
            if (!name) name = e.text().trim();
            if (!seen.has(name)) {
                seen.add(name);
                allChapters.push({
                    name: name,
                    url: e.attr('href'),
                    host: BASE_URL
                });
            }
        });
    }

    return Response.success(allChapters);
}