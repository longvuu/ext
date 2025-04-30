load('config.js');
function execute(url) {
    // Chuyển đổi sang CDN
    let cdnUrl = url.replace(/^https?:\/\/(www\.)?tvtruyen\.com\//, "https://cdn.cscldsck.com/chapters/");
    let response = fetch(cdnUrl);
    return Response.success(response.text());
}