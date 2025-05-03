load('config.js');

function execute(url) {
    let allChapters = [];
    let maxPage = 1;

    // Loại bỏ ?page nếu có trong url gốc
    url = url.replace(/\?page=\\d+/, '');

    // Fetch trang đầu để lấy số trang lớn nhất
    let response = fetch(url + "?page=1");
    if (!response.ok) return Response.success(allChapters);

    let doc = response.html();

    // Tìm số trang lớn nhất từ các <a> có data-url trong .pagination__item (bỏ disabled, lấy số lớn nhất)
    doc.select('li.pagination__item a[data-url]').forEach(a => {
        let pageUrl = a.attr('data-url');
        let match = pageUrl.match(/page=(\\d+)/);
        if (match) {
            let pageNum = parseInt(match[1]);
            if (pageNum > maxPage) maxPage = pageNum;
        }
    });

    // Lặp qua từng trang để lấy danh sách chương
    for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
        let pageUrl = url + "?page=" + currentPage;
        let pageResponse = fetch(pageUrl);
        if (!pageResponse.ok) break;
        let pageDoc = pageResponse.html();
        const seen = new Set();
        pageDoc.select('.chapter-list a').forEach(e => {
            let name = e.select('.chapter-title').text().trim();
            if (!name) name = e.text().trim();
            if (!seen.has(name)) {
                seen.add(name);
                allChapters.push({
                    name: name,
                    url: e.attr('href'),
                    host: BASE_URL
                });
            }
        });
    }

    return Response.success(allChapters);
}