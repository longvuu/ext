load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Lấy tên truyện - từ thẻ strong trong p.name
        let name = doc.select("div.detail p.name strong").text();

        // Lấy ảnh bìa - trực tiếp từ thẻ img trong div.detail
        let cover = doc.select("div.detail img").attr("src");
        if (cover && !cover.startsWith("http")) {
            cover = BASE_URL + cover;
        }

        // Lấy tác giả - từ thẻ a trong p.author
        let author = doc.select("div.detail p.author a").text();

        // Lấy mô tả - từ meta description nếu không có section.limit-desc
        let description = doc.select("meta[name=description]").attr("content") || "";

        // Lấy thể loại - từ thẻ a có class layui-btn-radius
        let genres = [];
        doc.select("div.detail p a.layui-btn-radius").forEach(e => {
            genres.push({
                title: e.text().trim(),
                input: e.attr("href"),
                script: "source.js"
            });
        });

        // Lấy trạng thái - từ span có class layui-btn-normal
        let statusText = doc.select("div.detail p span.layui-btn-normal").text();
        let ongoing = statusText.indexOf("完结") === -1; // "完结" là "Hoàn thành", nếu không có từ này thì đang "Đang ra"

        // Lấy chương mới nhất
        let latestChapter = doc.select("div.detail p.new a").text();

        return Response.success({
            name: name,
            cover: cover,
            author: author,
            description: description,
            genres: genres,
            ongoing: ongoing,
            host: BASE_URL,
            detail: latestChapter ? "Chương mới nhất: " + latestChapter : ""
        });
    }
    return null;
}