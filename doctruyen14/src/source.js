load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    
    // Build the correct URL for the requested page
    let requestUrl = url;
    if (page !== '1') {
        // Ensure URL ends with slash before adding page path
        if (!url.endsWith('/')) {
            requestUrl = url + "/";
        }
        requestUrl = requestUrl + "page/" + page + "/";
    }
    
    let response = fetch(requestUrl);
    if (!response.ok) {
        return Response.error("Không thể tải trang");
    }
    
    let doc = response.html();
    let articles = doc.select("article.post");
    
    let books = [];
    
    articles.forEach(e => {
        // Lấy title và link từ h2 > a.entry-title
        let titleElement = e.select("h2 a.entry-title").first();
        if (!titleElement) return;
        
        let name = titleElement.text().trim();
        let link = titleElement.attr("href");
        
        if (!name || !link) return;
        
        // Add page indicator for debugging
        if (page !== '1') {
            name = `[Trang ${page}] ${name}`;
        }
        
        // Lấy description từ "Giới Thiệu"
        let description = "";
        let introDiv = e.select(".noi-dung-bv-danh-muc").first();
        if (introDiv) {
            let introText = introDiv.text();
            let introMatch = /Giới Thiệu:\s*(.+?)(?:Tác Giả:|$)/.exec(introText);
            if (introMatch) {
                description = introMatch[1].trim();
                // Xóa các ký tự đặc biệt và giới hạn độ dài
                description = description.replace(/[""'']/g, '"').replace(/…/g, '...');
                if (description.length > 200) {
                    description = description.substring(0, 200) + "...";
                }
            }
        }
        
        // Lấy tác giả
        let author = "";
        let authorDiv = e.select(".noi-dung-bv-danh-muc:contains(Tác Giả:)").first();
        if (authorDiv) {
            let authorLink = authorDiv.select("a[rel=tag]").first();
            if (authorLink) {
                author = authorLink.text().trim();
            }
        }
        
        // Lấy ngày cập nhật
        let updateDate = "";
        let dateDiv = e.select(".noi-dung-bv-danh-muc:contains(Ngày Cập Nhật)").first();
        if (dateDiv) {
            let dateText = dateDiv.text();
            let dateMatch = /Ngày Cập Nhật[:\s]*(.+)/.exec(dateText);
            if (dateMatch) {
                updateDate = dateMatch[1].trim();
            }
        }
        
        // Tạo description đầy đủ
        let fullDescription = description;
        if (author) {
            fullDescription += " - Tác giả: " + author;
        }
        if (updateDate) {
            fullDescription += " - Cập nhật: " + updateDate;
        }
        
        books.push({
            name: name,
            link: link,
            cover: "", 
            description: fullDescription,
            host: BASE_URL,
        });
    });
    
    // Check if next page exists
    let nextPage = "";
    let currentPageInt = parseInt(page);
    let nextPageInt = currentPageInt + 1;
    
    // Build next page URL with proper slash handling
    let nextTestUrl = url;
    if (!url.endsWith('/')) {
        nextTestUrl = url + "/";
    }
    nextTestUrl = nextTestUrl + "page/" + nextPageInt + "/";
    
    let testResponse = fetch(nextTestUrl);
    if (testResponse.ok) {
        let testDoc = testResponse.html();
        let testArticles = testDoc.select("article.post");
        if (testArticles.size() > 0) {
            nextPage = nextPageInt.toString();
        }
    }
    
    return Response.success(books, nextPage);
}