load('config.js');

function execute(url) {
    url = url.replace("https://www.tvtruyen.com/","https://cdn.cscldsck.com/chapters/")
    console.log(url)
    let response = fetch(url, {
    headers: {
        "referer": "https://www.tvtruyen.com/",
    }})
    if (response.ok) {
        let doc = response.html();
        doc.select("h1").remove()
        doc.select("h2").remove()
        doc.select("h3").remove()
        return Response.success(doc.html());
    }
    return Response.error("Không thể tải nội dung chương. Vui lòng thử lại sau.");
}