load('config.js');

function execute(url, page) {
    let currentPage = page ? parseInt(page) : 1;
    url = url.replace(/\?page=\d+/, '');
    let pageUrl = url + "?page=" + currentPage;

    let response = fetch(pageUrl);
    if (!response.ok) return Response.error("Không thể tải danh sách chương");

    let doc = response.html();
    let chapters = [];

    doc.select('.story-detail__list-chapter--list .chapter-list li a').forEach(e => {
        let chapterUrl = e.attr('href');
        let name = e.select('.chapter-title').text().trim();
        if (!name) name = e.text().trim();
        chapters.push({
            name: name,
            url: chapterUrl,
            host: BASE_URL
        });
    });

    // Kiểm tra trang tiếp theo
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
        return Response.success(chapters, nextPage.toString());
    } else {
        return Response.success(chapters);
    }
}