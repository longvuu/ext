load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Lấy tên truyện
        let name = doc.select(".story-name").text();

        // Lấy ảnh bìa
        let cover = doc.select(".book-3d img").attr("src");

        // Lấy tác giả
        let author = doc.select(".story-detail__bottom--info a").first().text();

        // Lấy mô tả
        let description = doc.select(".story-detail__top--desc").text();

        // Lấy thể loại
        let genres = [];
        doc.select(".story-detail__bottom--info .d-flex.align-items-center.flex-warp a").forEach(e => {
            genres.push({
                title: e.text().replace(/,?$/, '').trim(),
                input: e.attr("href"),
                script: "source.js"
            });
        });

        // Lấy trạng thái
        let ongoing = doc.select(".story-detail__bottom--info .text-info").text().indexOf("Full") === -1;

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