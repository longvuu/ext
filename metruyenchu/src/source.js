load("config.js");

function execute(url, page) {
    if (!page) page = '1';
    let response = fetch(url + "?page=" + page);
    if (response.ok) {
        let doc = response.html();
        let nextPage = "";
        
        // Updated next page selection to match the actual HTML structure
        let nextLink = doc.select('a[aria-label="Go to next page"]');
        if (nextLink && nextLink.size() > 0) {
            let href = nextLink.attr("href");
            let match = /page=(\d+)/.exec(href);
            if (match) nextPage = match[1];
        }

        let books = [];
        doc.select(".grid.grid-cols-12.border-b.border-dashed").forEach(e => {
            let imageElement = e.select(".col-span-3.sm\\:col-span-2 img");
            let detailsElement = e.select(".col-span-9.sm\\:col-span-10");
            
            let name = detailsElement.select("h3[itemprop='name'] a").text();
            let link = detailsElement.select("h3[itemprop='name'] a").attr("href");
            let cover = imageElement.attr("src") || "";
            let author = detailsElement.select("span[itemProp='author']").text();
            let description = "";
            
            // Get description from paragraphs
            detailsElement.select(".mt-3.text-sm .mb-3").forEach(p => {
                description += p.text() + " ";
            });
            
            let chapterInfo = detailsElement.select("a.block.mt-4").text();
            
            books.push({
                name: name,
                link: link,
                cover: cover,
                description: description.trim() + " - " + chapterInfo,
                host: BASE_URL,
                author: author
            });
        });

        return Response.success(books, nextPage);
    }
    return null;
}