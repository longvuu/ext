load('config.js');

function execute(url, page) {
    if (!page) page = '1';
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);

    let response = fetch(url + "?page=" + page + "#list-chapter");
    if (response.ok) {
        let doc = response.html();
        let list = [];
        doc.select(".list-chapter li a").forEach(e => {
            list.push({
                name: e.select(".chapter-text-all").text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });

        // Lấy trang tiếp theo nếu có
        let nextPage = "";
        let nextLink = doc.select('a[rel="next"]');
        if (nextLink && nextLink.size() > 0) {
            let href = nextLink.attr("href");
            let match = /page=(\d+)/.exec(href);
            if (match) nextPage = match[1];
        }

        return Response.success(list, nextPage);
    }
    return null;
}