load("config.js");

function execute(url, page) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let books = [];
        doc.select(".section-stories-hot__list .story-item").forEach(e => {
            let aTag = e.select("a");
            let name = e.select(".story-item__name").text();
            let link = aTag.attr("href");
            let imgSrc = e.select(".story-item__image img").attr("src") || "";
            let cover = imgSrc.startsWith("http") ? imgSrc : BASE_URL + imgSrc;
            // Badge info (optional)
            let badges = [];
            e.select(".list-badge .story-item__badge").forEach(b => {
                badges.push(b.text());
            });
            let description = badges.join(", ");

            books.push({
                name: name,
                link: link,
                cover: cover,
                description: description,
                host: BASE_URL,
            });
        });

        return Response.success(books, nextPage);
    }
    return null;
}