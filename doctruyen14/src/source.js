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
        
        // Tìm nextPage từ pagination
        let currentPageNum = parseInt(page);
        let totalPages = 0;
        
        // Tìm tổng số trang từ tất cả các link trong pagination
        let pageLinks = doc.select('.wp-pagenavi a');
        pageLinks.forEach(link => {
            let href = link.attr("href");
            if (href) {
                // Thử tìm page number từ URL
                let match = /\/page\/(\d+)\//.exec(href);
                if (match) {
                    let pageNum = parseInt(match[1]);
                    if (pageNum > totalPages) {
                        totalPages = pageNum;
                    }
                }
            }
            
            // Cũng thử lấy từ text của link (cho các số trang)
            let linkText = link.text().trim();
            if (/^\d+$/.test(linkText)) {
                let pageNum = parseInt(linkText);
                if (pageNum > totalPages) {
                    totalPages = pageNum;
                }
            }
        });
        
        // Nếu không tìm được totalPages, thử tìm nextpostslink
        if (totalPages === 0) {
            let nextLink = doc.select('.wp-pagenavi a.nextpostslink');
            if (nextLink.size() > 0) {
                // Có next link nghĩa là có ít nhất trang tiếp theo
                totalPages = currentPageNum + 1;
            }
        }
        
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