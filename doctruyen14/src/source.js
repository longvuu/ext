load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    
    // Xây dựng URL đúng cách cho doctruyen14
    let requestUrl = url;
    if (page !== '1') {
        requestUrl = url + "page/" + page + "/";
    }
    
    let response = fetch(requestUrl);
    if (response.ok) {
        let doc = response.html();
        
        // Lấy trang cuối từ pagination
        let lastPage = 1;
        let lastPageLink = doc.select('.wp-pagenavi a.last').first();
        if (lastPageLink && lastPageLink.attr("href")) {
            let lastUrl = lastPageLink.attr("href");
            let lastPageMatch = /\/page\/(\d+)\//.exec(lastUrl);
            if (lastPageMatch) {
                lastPage = parseInt(lastPageMatch[1]);
            }
        } else {
            // Nếu không có link "Trang cuối", tìm số trang lớn nhất
            let pageLinks = doc.select('.wp-pagenavi a.page, .wp-pagenavi a.larger');
            pageLinks.forEach(link => {
                let href = link.attr("href");
                if (href) {
                    let pageMatch = /\/page\/(\d+)\//.exec(href);
                    if (pageMatch) {
                        let pageNum = parseInt(pageMatch[1]);
                        if (pageNum > lastPage) {
                            lastPage = pageNum;
                        }
                    }
                }
            });
        }

        let books = [];
        
        // Lấy tất cả books từ tất cả pages
        for (let currentPage = 1; currentPage <= lastPage; currentPage++) {
            let pageUrl = url;
            if (currentPage > 1) {
                pageUrl = url + "page/" + currentPage + "/";
            }
            
            let pageResponse = fetch(pageUrl);
            if (pageResponse.ok) {
                let pageDoc = pageResponse.html();
                let articles = pageDoc.select("article.post");
                
                articles.forEach(e => {
                    // Lấy title và link từ h2 > a.entry-title
                    let titleElement = e.select("h2 a.entry-title").first();
                    if (!titleElement) return;
                    
                    let name = titleElement.text().trim();
                    let link = titleElement.attr("href");
                    
                    if (!name || !link) return;
                    
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
                        cover: "", // Doctruyen14 không có cover image trong listing
                        description: fullDescription,
                        host: BASE_URL,
                    });
                });
            }
        }

        return Response.success(books, "");
    }
    
    return Response.error("Không thể tải trang");
}