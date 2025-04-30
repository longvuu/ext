load('config.js');

function execute(url) {
    // Xử lý cả hai trường hợp cdn.cscldsck.com và cdn-2.cscldsck.com
    url = url.replace("https://www.tvtruyen.com/", "https://cdn.cscldsck.com/chapters/");
    url = url.replace("https://cdn.cscldsck.com/chapters/", "https://cdn-2.cscldsck.com/chapters/");
    let response = fetch(url, {
        headers: {
            "referer": "https://www.tvtruyen.com/",
        }
    });
    if (!response.ok) {
        // Nếu cdn-2 thất bại, thử lại với cdn chính
        url = url.replace("https://cdn-2.cscldsck.com/chapters/", "https://cdn.cscldsck.com/chapters/");
        response = fetch(url, {
            headers: {
                "referer": "https://www.tvtruyen.com/",
            }
        });
    }
    if (response.ok) {
        let doc = response.html();
        doc.select("h1").remove();
        doc.select("h2").remove();
        doc.select("h3").remove();
        return Response.success(doc.html());
    }
    return Response.error("Không thể tải nội dung chương. Vui lòng thử lại sau.");
}