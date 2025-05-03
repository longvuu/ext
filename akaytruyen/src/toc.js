load('config.js');

function execute(url, page) {
    let chapters = [];
    let currentPage = page ? parseInt(page) : 1;
    let pageUrl = url + "?page=" + currentPage;
    let response = fetch(pageUrl);
    if (!response.ok) return null;

    let doc = response.html();
    // Lấy danh sách chương
    doc.select('.story-detail__list-chapter--list .chapter-list li a').forEach(e => {
        let name = e.select('.chapter-title').text().trim();
        if (!name) name = e.text().trim();
        chapters.push({
            name: name,
            url: e.attr('href'),
            host: BASE_URL
        });
    });

    // Kiểm tra có trang kế tiếp không (dựa vào nút >>)
    let nextPage = null;
    let nextArrow = doc.select('.pagination__arrow a[data-url]');
    if (nextArrow && nextArrow.size() > 0) {
        // Lấy số trang từ url
        let match = nextArrow.attr('data-url').match(/page=(\d+)/);
        if (match && parseInt(match[1]) > currentPage) {
            nextPage = parseInt(match[1]);
        }
    }

    return Response.success(chapters, nextPage);
}