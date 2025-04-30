load('config.js');

function execute(url, page) {
    let allChapters = [];
    let currentPage = page ? parseInt(page) : 1;
    let hasNext = true;

    while (hasNext) {
        let response = fetch(url + "?page=" + currentPage + "#list-chapter");
        if (!response.ok) break;

        let doc = response.html();
        doc.select(".list-chapter li a").forEach(e => {
            allChapters.push({
                name: e.select(".chapter-text-all").text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });

        // Kiểm tra trang tiếp theo
        let nextLink = doc.select('a[rel="next"]');
        if (nextLink && nextLink.size() > 0) {
            currentPage++;
        } else {
            hasNext = false;
        }
    }

    return Response.success(allChapters);
}