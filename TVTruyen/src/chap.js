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
        
        // Check for locked/paid chapters
        if (doc.select(".chapter-content .locked-content").size() > 0 || 
            doc.select(".chapter-content .premium-content").size() > 0) {
            return Response.error("Bạn cần trả phí chương này để có thể đọc.");
        }
        
        // Handle error page
        if (doc.select(".error-page").size() > 0 || doc.select(".not-found").size() > 0) {
            return Response.error("Không tìm thấy chương này.");
        }
        
        // Remove unwanted elements
        doc.select("script").remove();
        doc.select("noscript").remove();
        doc.select("iframe").remove();
        doc.select(".ads").remove();
        doc.select(".ad-container").remove();
        doc.select("div.chapter-nav").remove();
        doc.select("div.chapter-bottom").remove();
        doc.select("div.comment-section").remove();
        
        // Try different chapter content selectors to handle website changes
        let content = "";
        if (doc.select(".chapter-content").size() > 0) {
            content = doc.select(".chapter-content").html();
        } else if (doc.select(".chapter-body").size() > 0) {
            content = doc.select(".chapter-body").html();
        } else if (doc.select(".content-chap").size() > 0) {
            content = doc.select(".content-chap").html();
        } else if (doc.select("#chapter-content").size() > 0) {
            content = doc.select("#chapter-content").html();
        } else {
            // Try to find content by looking for large text blocks
            let possibleContent = doc.select("div.container > div > div > div > p");
            if (possibleContent.size() > 3) {
                content = possibleContent.html();
            } else {
                return Response.error("Không thể tìm thấy nội dung chương. Định dạng trang có thể đã thay đổi.");
            }
        }
        
        // Check if content is empty or very short
        if (!content || content.length < 100) {
            return Response.error("Nội dung chương quá ngắn hoặc trống. Có thể chương này yêu cầu đăng nhập hoặc trả phí.");
        }
        
        return Response.success(content);
    }
    
    return Response.error("Không thể tải nội dung chương. Vui lòng thử lại sau.");
}