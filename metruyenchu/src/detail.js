load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Lấy tên truyện - Get book title
        let name = doc.select("h1 span[itemProp=name]").text().replace(" - Truyện Chữ", "");

        // Lấy ảnh bìa - Get cover image
        let cover = doc.select("figure img[itemProp=image]").attr("src");

        // Lấy tác giả - Get author
        let author = doc.select("div[itemProp=author] span[itemProp=name]").text();

        // Lấy mô tả - Get description
        let description = doc.select(".prose.max-w-none.text-justify").first().text();

        // Lấy thể loại - Get genres
        let genres = [];
        doc.select("ul.flex.flex-wrap li a[itemProp=genre]").forEach(e => {
            genres.push({
                title: e.text().trim(),
                input: e.attr("href"),
                script: "source.js"
            });
        });

        // Lấy trạng thái - Get status (ongoing or completed)
        // "Còn tiếp" means ongoing, anything else is considered completed
        let statusText = doc.select(".col-span-1:last-child strong").text();
        let ongoing = statusText.indexOf("Còn tiếp") !== -1;

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            genres: genres,
            ongoing: ongoing,
            host: BASE_URL,
        });
    }
    return null;
}