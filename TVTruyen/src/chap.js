load('config.js');
function execute(url, reference) {
    // Chuyển đổi sang CDN
    let cdnUrl = url.replace(/^https?:\/\/(www\.)?tvtruyen\.com\//, "https://cdn.cscldsck.com/chapters/");
    print("CDN URL: " + cdnUrl);
    let response = fetch(cdnUrl, { referer: reference });
    if (response && response.ok) {
       return Response.success(response.text());
    }
    return Response.error("Không lấy được nội dung chương từ CDN.");
}