load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let nextPage = "";
        let nextLink = doc.select('a[rel="next"]');
        if (nextLink && nextLink.size() > 0) {
            let href = nextLink.attr("href");
            let match = /page=(\d+)/.exec(href);
            if (match) nextPage = match[1];
        }

        let books = [];
        doc.select(".category-list-container .info-mobile-card").forEach(e => {
            let name = e.select(".name > a").text();
            let link = e.select(".name > a").attr("href");
            let imgSrc = e.select(".info-image img").attr("src") || "";
            let cover = imgSrc.startsWith("http") ? imgSrc : BASE_URL + imgSrc;
            let chapterInfo = e.select(".chapter-text").text();
            let timeInfo = e.select(".category-list-info-timeago").text();

            books.push({
                name: name,
                link: link,
                cover: cover,
                description: chapterInfo + " - " + timeInfo,
                host: BASE_URL,
            });
        });

        return Response.success(books, nextPage);
    }
    return null;
}