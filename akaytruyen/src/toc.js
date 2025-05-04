load('config.js');

function execute(url) {
    let allChapters = [];
    let maxPage = 1;
    url = url.replace(/\?page=\d+/, '');
    if (url.indexOf("/truyen/con-duong-ba-chu") !== -1) {
        maxPage = 65;
    }
    for (let currentPage = 1; currentPage <= maxPage; currentPage++) {
        let pageUrl = url + "?page=" + currentPage;
        let pageResponse = fetch(pageUrl);
        if (!pageResponse.ok) break;
        let pageDoc = pageResponse.html();
        const seen = new Set();
        // Lấy nhanh tất cả chương từ selector tối ưu
        pageDoc.select('.story-detail__list-chapter--list ul.chapter-list a').forEach(e => {
            let name = e.select('.chapter-title.ms-2').text().trim();
            if (!name) return;
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
    
    // Đảo ngược thứ tự chương để có thứ tự đúng (từ chương cũ đến chương mới)
    allChapters.reverse();

    return Response.success(allChapters);
}