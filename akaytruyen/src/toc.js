load('config.js');

function execute(url, page) {
    let allChapters = {};  // Use object instead of array to track unique URLs
    let currentPage = page ? parseInt(page) : 1;
    let hasNext = true;
    let result = [];

    // Đảm bảo url luôn có dạng https://akaytruyen.com/truyen/xxx (không có ?page)
    url = url.replace(/\?page=\d+/, '');

    while (hasNext) {
        // Luôn fetch với url gốc + ?page=currentPage
        let pageUrl = url + "?page=" + currentPage;

        // Nếu không phải trang đầu tiên, kiểm tra pagination__arrow pagination__item để lấy link mới
        if (currentPage !== 1) {
            let tempResponse = fetch(url + "?page=" + currentPage);
            if (!tempResponse.ok) break;
            let tempDoc = tempResponse.html();
            // Lấy đúng mũi tên phân trang (>>)
            let arrowLi = tempDoc.select('li.pagination__arrow.pagination__item a[data-url]');
            if (arrowLi && arrowLi.size() > 0) {
                let arrowUrl = arrowLi.attr('data-url');
                if (arrowUrl) {
                    pageUrl = arrowUrl;
                }
            }
        }

        let response = fetch(pageUrl);
        if (!response.ok) break;

        let doc = response.html();
        // Lấy danh sách chương từ cả mobile và desktop view
        // Chỉ xử lý một lần và tránh trùng lặp bằng cách dùng URL làm key
        doc.select('.story-detail__list-chapter--list .chapter-list li a').forEach(e => {
            let chapterUrl = e.attr('href');
            if (!allChapters[chapterUrl]) {
                let name = e.select('.chapter-title').text().trim();
                if (!name) name = e.text().trim();
                
                allChapters[chapterUrl] = {
                    name: name,
                    url: chapterUrl,
                    host: BASE_URL
                };
            }
        });

        // Kiểm tra trang tiếp theo (chỉ lấy mũi tên sang phải >>)
        let nextPage = null;
        let nextArrow = doc.select('li.pagination__arrow.pagination__item a[data-url]:last-child');
        if (nextArrow && nextArrow.size() > 0) {
            let nextUrl = nextArrow.attr('data-url');
            let match = nextUrl.match(/page=(\d+)/);
            if (match && parseInt(match[1]) > currentPage) {
                nextPage = parseInt(match[1]);
            }
        }
        
        if (nextPage) {
            currentPage = nextPage;
        } else {
            hasNext = false;
        }
    }

    // Chuyển object thành array để trả về
    for (let key in allChapters) {
        result.push(allChapters[key]);
    }

    return Response.success(result);
}