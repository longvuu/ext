load('config.js');

function execute(url, page) {
    let allChapters = [];
    let currentPage = page ? parseInt(page) : 1;
    let hasNext = true;

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
        let currentPageItem = doc.select('.pagination .page-current a.page-link');
        if (currentPageItem && currentPageItem.size() > 0) {
            let nextItem = currentPageItem.parent().next();
            if (nextItem && nextItem.select('a.page-link').size() > 0) {
                nextPage = nextItem.select('a.page-link').attr('data-url');
            }
        }
        if (nextPage) {
            currentPage++;
        } else {
            hasNext = false;
        }
    }

    return Response.success(allChapters);
}