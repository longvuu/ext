load('config.js');

function execute(url) {
    let allChapters = [];
    let currentPage = 1;
    let hasNext = true;

    // Loại bỏ ?page nếu có trong url gốc
    url = url.replace(/\?page=\\d+/, '');

    while (hasNext) {
        let pageUrl = url + "?page=" + currentPage;
        let response = fetch(pageUrl);
        if (!response.ok) break;

        let doc = response.html();
        // Lấy tất cả link chương
        doc.select('.chapter-list a').forEach(e => {
            let name = e.select('.chapter-title').text().trim();
            if (!name) name = e.text().trim();
            allChapters.push({
                name: name,
                url: e.attr('href'),
                host: BASE_URL
            });
        });

        // Phân trang: lấy tất cả mũi tên, chọn page lớn nhất
        let nextPage = null;
        let maxPage = currentPage;
        let arrows = doc.select('li.pagination__arrow.pagination__item a[data-url]');
        if (arrows && arrows.size() > 0) {
            arrows.forEach(a => {
                let nextUrl = a.attr('data-url');
                let match = nextUrl.match(/page=(\\d+)/);
                if (match) {
                    let pageNum = parseInt(match[1]);
                    if (pageNum > maxPage) {
                        maxPage = pageNum;
                    }
                }
            });
            if (maxPage > currentPage) {
                nextPage = maxPage;
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