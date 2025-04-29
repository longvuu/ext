load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();

        let nextPage = /page=(\d+)/.exec(doc.select(".next-page").first().attr("href"));
        if (nextPage) nextPage = nextPage[1];
        else nextPage = "";

        let books = [];
        doc.select(".info-mobile-card").forEach(e => {
            let name = e.select(".name > a").text();
            let link = e.select(".name > a").attr("href");
            let cover = e.select(".info-image > img").attr("src");
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