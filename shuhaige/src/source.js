load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let response;
    if (url.includes("/shuku/")) {
        let baseUrl = url.replace(/\/\d+\.html$/, "");
        if (baseUrl.endsWith("/shuku/")) {
            response = fetch(baseUrl + "0_0_0_" + page + ".html");
        } else {
            let urlParts = url.split('/');
            let lastPart = urlParts[urlParts.length - 1];
            let pattern = lastPart.replace(/\d+\.html$/, page + ".html");
            urlParts[urlParts.length - 1] = pattern;
            response = fetch(urlParts.join('/'));
        }
    } else {
        response = fetch(url + (url.includes("?") ? "&" : "?") + "page=" + page);
    }
    
    if (response.ok) {
        let doc = response.html();
        let nextPage = "";
        
        // Cải tiến phần xử lý phân trang
        let paginationLinks = doc.select('div.pagelist a');
        if (paginationLinks && paginationLinks.size() > 0) {
            // Kiểm tra URL hiện tại để xác định trang
            let currentUrl = response.url;
            
            // Tìm link "下一页" (Trang tiếp theo)
            let nextPageLink = null;
            for (let i = 0; i < paginationLinks.size(); i++) {
                let link = paginationLinks.get(i);
                let text = link.text();
                if (text === "下一页") {
                    nextPageLink = link;
                    break;
                }
            }
            
            // Nếu không tìm thấy bằng text, sử dụng logic vị trí cũ
            if (!nextPageLink) {
                let isFirstPage = currentUrl.includes("/0_0_0_1.html") || 
                                currentUrl.endsWith("/shuku/") || 
                                page === '1';
                
                let targetLinkIndex = isFirstPage ? 0 : 2;
                if (targetLinkIndex < paginationLinks.size()) {
                    nextPageLink = paginationLinks.get(targetLinkIndex);
                }
            }
            
            // Trích xuất số trang từ URL của link tiếp theo
            if (nextPageLink) {
                let href = nextPageLink.attr("href");
                // Trích xuất số trang từ URL cả với định dạng .html hoặc tham số page
                let match = href.match(/\/(\d+)\.html$/) || href.match(/[?&]page=(\d+)/);
                if (match && match[1]) {
                    nextPage = match[1];
                    console.log("Tìm thấy trang tiếp theo: " + nextPage + " từ URL: " + href);
                }
            }
        }
        
        let books = [];
        doc.select("ul.list li").forEach(e => {
            try {
                let bookNameAnchor = e.select("p.bookname > a");
                if (bookNameAnchor.size() === 0) return; 
                
                let name = bookNameAnchor.text();
                let link = bookNameAnchor.attr("href");
                
                // Xử lý ảnh bìa
                let imgElem = e.select("li > a > img");
                let imgSrc = "";
                if (imgElem.size() > 0) {
                    imgSrc = imgElem.attr("src") || "";
                }
                let cover = imgSrc.startsWith("http") ? imgSrc : BASE_URL + imgSrc;
                
                let author = e.select("p.data > a.layui-btn-xs.layui-bg-cyan").text();
                
                let genreSpans = e.select("p.data > span.layui-btn-xs.layui-btn-radius");
                let genre = genreSpans.size() > 0 ? genreSpans.first().text() : "";
                
                let status = genreSpans.size() > 1 ? genreSpans.last().text() : "";
                
                let intro = e.select("p.intro").text();
                let latestChap = e.select("p.data:last-child > a").text();

                books.push({
                    name: name,
                    link: link,
                    cover: cover,
                    description: intro,
                    host: BASE_URL,
                    author: author,
                    genre: genre,
                    status: status === "完结" ? "Completed" : "Ongoing",
                    detail: latestChap
                });
            } catch (error) {
                console.log("Error processing book item: " + error);
            }
        });

        return Response.success(books, nextPage);
    }
    return null;
}