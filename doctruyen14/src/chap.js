load('config.js');

function execute(url) {
    // Add headers to mimic a real browser request
    let response = fetch(url, {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://doctruyen14.vip/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
    });    
    if (response.ok) {
        let doc = response.html();
        
        // Check if we got redirected to homepage by looking for specific elements
        let isHomePage = doc.select(".site-header").length > 0 && doc.select(".entry-content").length === 0;
        let hasMainContent = doc.select(".entry-content").length > 0;
        
        if (isHomePage || !hasMainContent) {
            return Response.error("Trang này có thể bị chuyển hướng hoặc không có nội dung. Vui lòng thử lại hoặc kiểm tra URL.");
        }
        
        // Extract the main content from the entry-content div
        let chapterContent = doc.select(".entry-content");
        
        // Remove unwanted elements
        chapterContent.select("script").remove();
        chapterContent.select(".wp-pagenavi").remove();
        chapterContent.select("#daextam-post-id").remove();
        chapterContent.select("input[type='hidden']").remove();
          // Get the chapter title from h1.entry-title
        let chapterTitle = doc.select("h1.entry-title").text();
        
        // Only accept page number if URL is /ten-truyen/2/ or /ten-truyen/2
        let pageNumber = "1";
        let urlNoQuery = url.split('?')[0];
        let match = urlNoQuery.match(/\/([0-9]+)\/?$/); // /ten-truyen/2/ or /ten-truyen/2
        if (match) {
            pageNumber = match[1];
        }
        
        // Clean up the content - remove any remaining unwanted elements
        chapterContent.select("div[id*='wpdiscuz']").remove();
        chapterContent.select("div[class*='wpdiscuz']").remove();
        chapterContent.select("div[id*='wpd-']").remove();
        chapterContent.select(".wpdiscuz_top_clearing").remove();
        chapterContent.select("#comments").remove();
        chapterContent.select(".comments-area").remove();
        
        // Get the cleaned HTML content
        let content = chapterContent.html();
        
        // Clean up any remaining unwanted text patterns
        if (content) {
            // Remove rating section if it exists
            content = content.replace(/<div[^>]*wpd-post-rating[^>]*>[\s\S]*?<\/div>/gi, "");
            // Remove any remaining comment related content
            content = content.replace(/\s*Đánh giá bài viết\s*/gi, "");
        }
        
        // Create enhanced title with page number
        let finalTitle = chapterTitle;
        if (pageNumber !== "1") {
            finalTitle = chapterTitle + " - Trang " + pageNumber;
        }
        
        // Add the title to the content
        if (finalTitle) {
            content = "<h1>" + finalTitle + "</h1>" + content;
        }
        
        return Response.success(content);
    }
    
    return Response.error("Không thể tải nội dung chương. Vui lòng thử lại sau.");
}