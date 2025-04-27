load('config.js');

function execute(key, page) {
    if (!page) page = '1';
    
    let response = fetch(BASE_URL + "/tim-kiem", {
        method: "GET",
        queries: {
            "q": key,
            "page": page
        }
    });
    
    if (response.ok) {
        let doc = response.html();
        
        // Check for access restrictions or login requirements
        if (doc.select("title").text().includes("Đăng nhập") || doc.select("title").text().includes("Login")) {
            return Response.error("Bạn cần đăng nhập hoặc tạo tài khoản mới để tiếp tục đọc truyện.");
        }
        
        let novelList = [];
        let next = doc.select(".pagination > li.active + li").last().text();
        
        // No results check
        if (doc.select(".list-stories .story-item").size() == 0) {
            return Response.success(novelList, null);
        }
        
        doc.select(".list-stories .story-item").forEach(e => {
            novelList.push({
                name: e.select(".story-title a").text(),
                link: e.select(".story-title a").first().attr("href"),
                description: e.select(".chapter-latest a").text(),
                cover: e.select(".story-cover img").first().attr("src"),
                host: BASE_URL
            });
        });
        
        return Response.success(novelList, next);
    }
    
    return null;
}