load('config.js');

function execute(url, page) {
    let allChapters = [];
    let currentPage = page ? parseInt(page) : 1;
    let hasNext = true;

    // Đảm bảo url luôn có dạng https://akaytruyen.com/truyen/xxx?page=1
    // Loại bỏ tham số ?page nếu có sẵn trong url
    url = url.replace(/\?page=\d+/, '');

    while (hasNext) {
        let pageUrl = url + "?page=" + currentPage;
        let response = fetch(pageUrl);
        if (!response.ok) break;

        let doc = response.html();
        // Lấy danh sách chương
        doc.select('.story-detail__list-chapter--list .chapter-list li a').forEach(e => {
            let name = e.select('.chapter-title').text().trim();
            if (!name) name = e.text().trim();
            allChapters.push({
                name: name,
                url: e.attr('href'),
                host: BASE_URL
            });
        });

        // Kiểm tra trang tiếp theo
        let nextPage = null;
        let nextArrow = doc.select('.pagination__arrow a[data-url]');
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

    return Response.success(allChapters);
}