load("config.js");

function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();

        // Lấy tên truyện - sửa selector
        let name = "";
        let nameElements = doc.select(".muc-luc p");
        for (let i = 0; i < nameElements.size(); i++) {
            let element = nameElements.get(i);
            let text = element.text();
            if (text.includes("Tên Truyện:")) {
                name = text.replace("Tên Truyện:", "").trim();
                break;
            }
        }

        // Lấy ảnh bìa
        let cover = "";
        let imgElement = doc.select("img").first();
        if (imgElement) {
            cover = imgElement.attr("src") || "";
        }

        // Lấy tác giả
        let author = "";
        let mucLucElements = doc.select(".muc-luc p");
        for (let i = 0; i < mucLucElements.size(); i++) {
            let element = mucLucElements.get(i);
            let text = element.text();
            if (text.includes("Tác Giả:")) {
                let authorLink = element.select("a").first();
                if (authorLink) {
                    author = authorLink.text().trim();
                } else {
                    author = text.replace("Tác Giả:", "").trim();
                }
                break;
            }
        }

        // Lấy mô tả từ nội dung truyện
        let description = "";
        let contentElements = doc.select(".entry-content p");
        if (contentElements.size() > 0) {
            let firstParagraph = contentElements.get(0);
            let fullText = firstParagraph.text();
            description = fullText.length > 200 ? fullText.substring(0, 200) + "..." : fullText;
        }

        // Lấy thể loại từ danh mục
        let genres = [];
        let categoryElements = doc.select(".muc-luc p");
        for (let i = 0; i < categoryElements.size(); i++) {
            let element = categoryElements.get(i);
            let text = element.text();
            if (text.includes("Danh Mục:") || text.includes("Thể Loại:")) {
                let links = element.select("a");
                for (let j = 0; j < links.size(); j++) {
                    let link = links.get(j);
                    genres.push({
                        title: link.text().trim(),
                        input: link.attr("href"),
                        script: "source.js"
                    });
                }
            }
        }

        // Lấy trạng thái
        let ongoing = true;
        let statusElements = doc.select(".muc-luc p");
        for (let i = 0; i < statusElements.size(); i++) {
            let element = statusElements.get(i);
            let text = element.text();
            if (text.includes("Full") || text.includes("Hoàn thành") || text.includes("Đã hoàn thành")) {
                ongoing = false;
                break;
            }
        }

        return Response.success({
            name: name || "Không có tên",
            cover: cover,
            author: author || "Không rõ tác giả",
            description: description || "Không có mô tả",
            genres: genres,
            ongoing: ongoing,
            host: BASE_URL
        });
    }
    return Response.error("Không thể tải trang");
}