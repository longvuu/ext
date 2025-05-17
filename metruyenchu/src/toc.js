load('config.js');

function execute(url, page) {
    let allChapters = [];
    let currentPage = page ? parseInt(page) : 1;
    
    // Extract the story slug from the URL
    let slug = url.split('/').pop();
    
    // Make a request to the API endpoint
    let apiUrl = BASE_URL + "/api/story-get-list-chapter?url=" + slug + "&page=" + currentPage;
    let response = fetch(apiUrl);
    
    if (response.ok) {
        let data = response.json();
        
        if (data && data.chapters) {
            // Process chapters from API response
            data.chapters.forEach(chapter => {
                allChapters.push({
                    name: chapter.title || chapter.name,
                    url: chapter.url || `/${slug}/${chapter.slug || chapter.chap_slug}`,
                    host: BASE_URL
                });
            });
            
            // Return chapters with next page info
            let nextPage = data.next_page || (data.total_pages > currentPage ? (currentPage + 1).toString() : null);
            return Response.success(allChapters, nextPage);
        }
    }
    
    // Fallback: try to parse chapters from HTML if API fails
    response = fetch(url + "#danh-sach-chuong");
    if (response.ok) {
        let doc = response.html();
        doc.select("#danh-sach-chuong .list-chapter li a").forEach(e => {
            allChapters.push({
                name: e.text(),
                url: e.attr("href"),
                host: BASE_URL
            });
        });
        
        // Check for next page using the correct selector
        let nextLink = doc.select('a[aria-label="Go to next page"]');
        if (nextLink && nextLink.size() > 0) {
            currentPage++;
            return Response.success(allChapters, currentPage.toString());
        }
        
        // If no chapters found, try to extract total chapter count from script data
        if (allChapters.length === 0) {
            let scriptData = doc.select("script:containsData(total_chap)").html();
            if (scriptData) {
                let match = scriptData.match(/total_chap\D+(\d+)/);
                if (match) {
                    let totalChapters = parseInt(match[1]);
                    for (let i = 1; i <= totalChapters; i++) {
                        allChapters.push({
                            name: "Chương " + i,
                            url: url + "/chuong-" + i,
                            host: BASE_URL
                        });
                    }
                }
            }
        }
        
        return Response.success(allChapters);
    }
    
    return null;
}