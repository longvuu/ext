load('config.js');

function execute(url, page) {
    let response = fetch(url);
    if (!response.ok) return Response.error("Cannot fetch page");

    let doc = response.html();
    
    // Lấy tổng số trang từ phân trang
    let pageLinks = doc.select('.wp-pagenavi a.page');
    let totalPages = 1;
    
    if (pageLinks.size() > 0) {
        // Lấy số trang lớn nhất
        pageLinks.forEach(a => {
            let pageText = a.text().trim();
            let pageNum = parseInt(pageText);
            if (!isNaN(pageNum) && pageNum > totalPages) {
                totalPages = pageNum;
            }
        });
    }    // Tạo danh sách chương dựa trên số trang
    let chapters = [];
    for (let i = 1; i <= totalPages; i++) {
        let chapterUrl = url;
        if (i > 1) {
            // Kiểm tra và đảm bảo URL kết thúc bằng dấu /
            if (!chapterUrl.endsWith('/')) {
                chapterUrl = chapterUrl + '/';
            }
            // Cấu trúc URL phải là /ten-truyen/2/
            chapterUrl = chapterUrl + i + "/";
        }
        
        chapters.push({
            name: `Chương ${i}`,
            url: chapterUrl,
            host: BASE_URL
        });
    }

    return Response.success(chapters);
}