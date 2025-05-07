load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Lấy tên truyện
        let name = doc.select("h3.title#comic_name").text();

        // Lấy ảnh bìa
        let cover = doc.select(".book img").attr("src");

        // Lấy tác giả
        let author = doc.select(".author a.item-value").text();

        // Lấy mô tả
        let description = doc.select("section.limit-desc").text();

        // Lấy thể loại
        let genres = [];
        doc.select(".genres a.item-value").forEach(e => {
            genres.push({
                title: e.text().trim(),
                input: e.attr("href"),
                script: "source.js"
            });
        });

        // Lấy trạng thái
        let ongoing = doc.select(".info .item-value.text-success").text().indexOf("Full") === -1;

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