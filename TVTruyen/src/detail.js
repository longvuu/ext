load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        
        // Check for access restrictions or login requirements
        if (doc.select("title").text().includes("Đăng nhập") || doc.select("title").text().includes("Login")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        
        let genres = [];
        doc.select(".story-info .categories a").forEach(e => {
            genres.push({
                title: e.text(),
                input: e.attr("href"),
                script: "gen.js"
            });
        });
        
        // Check completion status
        let ongoing = true;
        if (doc.select(".story-details .info").text().indexOf("Hoàn thành") >= 0 || 
            doc.select(".story-details .info").text().indexOf("Full") >= 0) {
            ongoing = false;
        }
        
        // Create suggestions array for similar content
        let suggests = [];
        if (doc.select(".related-stories").size() > 0) {
            suggests.push({
                title: "Truyện liên quan",
                input: url,
                script: "related.js"
            });
        }
        
        return Response.success({
            name: doc.select(".story-details h1").text(),
            cover: doc.select(".story-details .story-cover img").first().attr("src"),
            author: doc.select(".story-details .author a").text(),
            description: doc.select(".story-details .description").html(),
            detail: doc.select(".story-details .info").html(),
            host: BASE_URL,
            ongoing: ongoing,
            genres: genres,
            suggests: suggests
        });
    }
    
    return null;
}