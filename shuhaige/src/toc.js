load('config.js');

function execute(url) {
    // Loại bỏ các tham số không cần thiết từ URL
    let bookId = url.match(/\/shu_(\d+)\.html/) || url.match(/\/(\d+)\//);
    if (!bookId) return Response.error("Không tìm thấy ID sách");
    
    bookId = bookId[1];
    let chapters = [];
    
    // Trước tiên, lấy trang đầu tiên để kiểm tra tổng số trang
    let firstResponse = fetch(BASE_URL + "/" + bookId + "/");
    if (!firstResponse.ok) {
        return Response.error("Không thể tải trang đầu tiên");
    }
    
    let doc = firstResponse.html();
    
    // Thêm chương từ trang đầu tiên
    doc.select("ul.read li").forEach(e => {
        let a = e.select("a").first();
        if (a) {
            chapters.push({
                name: a.text(),
                url: a.attr("href"),
                host: BASE_URL
            });
        }
    });
    
    // Kiểm tra có tổng số trang từ dropdown
    let totalPages = 1;
    let pageOptions = doc.select("div.pagelist .pagenum select option");
    if (pageOptions.size() > 0) {
        totalPages = pageOptions.size(); // Số lượng options chính là số trang
        console.log("Tổng số trang: " + totalPages);
        
        // Tải các trang còn lại từ trang 2 đến hết
        for (let i = 2; i <= totalPages; i++) {
            let nextUrl = BASE_URL + "/" + bookId + "_" + i + "/";
            console.log("Đang tải trang: " + nextUrl);
            
            let response = fetch(nextUrl);
            if (response.ok) {
                let nextDoc = response.html();
                nextDoc.select("ul.read li").forEach(e => {
                    let a = e.select("a").first();
                    if (a) {
                        chapters.push({
                            name: a.text(),
                            url: a.attr("href"),
                            host: BASE_URL
                        });
                    }
                });
            } else {
                console.log("Không thể tải trang: " + nextUrl);
            }
        }
    } else {
        // Nếu không tìm thấy thông tin phân trang, dùng phương pháp cũ
        let pageIndex = 1;
        let maxTries = 20; // Giới hạn số lần thử
        let emptyPageCount = 0;
        
        while (pageIndex <= maxTries) {
            let nextUrl = BASE_URL + "/" + bookId + "_" + pageIndex + "/";
            let response = fetch(nextUrl);
            
            if (response.ok) {
                let nextDoc = response.html();
                let pageChapters = nextDoc.select("ul.read li");
                
                if (pageChapters.size() > 0) {
                    emptyPageCount = 0;
                    pageChapters.forEach(e => {
                        let a = e.select("a").first();
                        if (a) {
                            chapters.push({
                                name: a.text(),
                                url: a.attr("href"),
                                host: BASE_URL
                            });
                        }
                    });
                } else {
                    emptyPageCount++;
                    if (emptyPageCount >= 2) break;
                }
            } else {
                emptyPageCount++;
                if (emptyPageCount >= 2) break;
            }
            
            pageIndex++;
        }
    }
    
    if (chapters.length > 0) {
        return Response.success(chapters);
    }
    
    return Response.error("Không thể tải danh sách chương");
}