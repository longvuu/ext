load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Check for login requirements
        if (doc.select("title").text().includes("Đăng nhập") || doc.select("title").text().includes("Login")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        
        let chapters = [];
        doc.select(".list-chapters .chapter-item").forEach(e => {
            chapters.push({
                name: e.select("a").text(),
                url: e.select("a").attr("href"),
                host: BASE_URL
            });
        });
        
        // Check if chapters are found
        if (chapters.length === 0) {
            return Response.error("Không tìm thấy danh sách chương.");
        }
        
        // Arrange chapters in reading order (if currently in reverse)
        if (chapters.length > 1) {
            let first = chapters[0].name;
            let last = chapters[chapters.length - 1].name;
            
            // If first chapter number is greater than last chapter, we need to reverse the list
            let firstNum = parseInt(first.match(/\d+/));
            let lastNum = parseInt(last.match(/\d+/));
            if (firstNum && lastNum && firstNum > lastNum) {
                chapters.reverse();
            }
        }
        
        return Response.success(chapters);
    }
    
    return null;
}