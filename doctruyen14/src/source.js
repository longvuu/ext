load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    
    // Xây dựng URL đúng cách
    let requestUrl = url;
    if (page !== '1') {
        requestUrl = url + "page/" + page + "/";
    }
    
    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        let nextPage = "";
        
        // Tìm nextPage đơn giản - tăng page hiện tại lên 1
        let currentPageNum = parseInt(page);
        let totalPages = 0;
        
        // Tìm tổng số trang từ pagination
        let pageLinks = doc.select('.wp-pagenavi a');
        pageLinks.forEach(link => {
            let href = link.attr("href");
            if (href) {
                let match = /\/page\/(\d+)\//.exec(href);
                if (match) {
                    let pageNum = parseInt(match[1]);
                    if (pageNum > totalPages) {
                        totalPages = pageNum;
                    }
                }
            }
        });
        
        // Nếu trang hiện tại nhỏ hơn tổng số trang thì có next page
        if (currentPageNum < totalPages) {
            nextPage = (currentPageNum + 1).toString();
        }

        let books = [];
        
        // Thử nhiều selector khác nhau
        let articles = doc.select("article.post");
        if (articles.size() === 0) {
            articles = doc.select(".post");
        }
        if (articles.size() === 0) {
            articles = doc.select("article");
        }
        
        articles.forEach(e => {
            // Thử nhiều cách lấy title
            let titleElement = e.select("h2 a");
            if (titleElement.size() === 0) {
                titleElement = e.select("h2").select("a");
            }
            if (titleElement.size() === 0) {
                titleElement = e.select("a.entry-title");
            }
            
            let name = titleElement.text().trim();
            let link = titleElement.attr("href");
            
            if (!name || !link) return;
            
            // Lấy mô tả
            let description = "";
            let descElements = e.select("p");
            descElements.forEach(p => {
                let text = p.text();
                if (text.includes("Giới Thiệu:")) {
                    description = text.replace("Giới Thiệu:", "").replace(/^[:\s]+/, "").trim();
                }
            });
            
            // Lấy tác giả
            let author = "";
            let authorLinks = e.select("a");
            authorLinks.forEach(a => {
                if (a.attr("href").includes("/tac-gia/")) {
                    author = a.text().trim();
                }
            });
            
            // Lấy ngày cập nhật
            let updateDate = "";
            let allText = e.text();
            let dateMatch = /Ngày Cập Nhật[:\s]*([^\n\r]+)/i.exec(allText);
            if (dateMatch) {
                updateDate = dateMatch[1].trim();
            }
            
            books.push({
                name: name,
                link: link,
                cover: "",
                description: description + (updateDate ? " - Cập nhật: " + updateDate : ""),
                host: BASE_URL,
                author: author || "Không rõ"
            });
        });

        return Response.success(books, nextPage);
    }
    
    return Response.error("Không thể tải trang");
}