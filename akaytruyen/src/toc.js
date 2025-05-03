load('config.js');

function execute(url, page) {
    // If no page is provided, start with the first page
    if (!page) {
        page = '1';
        // Check if we're dealing with a novel that has many chapters
        let response = fetch(url);
        if (response.ok) {
            let doc = response.html();
            let lastPage = 1;
            
            // Try to find the last page number
            let pageLinks = doc.select('.pagination__number');
            if (pageLinks.size() > 0) {
                pageLinks.forEach(e => {
                    let pageNum = parseInt(e.text().trim());
                    if (!isNaN(pageNum) && pageNum > lastPage) {
                        lastPage = pageNum;
                    }
                });
            }
            
            // If the novel has many pages, use pagination approach
            if (lastPage > 3) {
                // Return only current page chapters with next page info
                return parsePage(url, page, true);
            }
        }
    }
    
    // For small novels or continuing pagination
    return parsePage(url, page);
}

// Function to parse a single page
function parsePage(url, page, enablePagination = false) {
    // Remove any existing page parameter
    url = url.replace(/\?page=\d+/, '');
    let currentPage = parseInt(page);
    let pageUrl = url + "?page=" + currentPage;
    
    let response = fetch(pageUrl);
    if (!response.ok) return Response.error("Không thể tải trang " + currentPage);
    
    let doc = response.html();
    let chapters = [];
    
    // Extract chapters from current page
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
    
    // Determine next page
    let nextPage = null;
    let pageLinks = doc.select('.pagination__number');
    if (pageLinks.size() > 0) {
        pageLinks.forEach(e => {
            let pageNum = parseInt(e.text().trim());
            if (!isNaN(pageNum) && pageNum > currentPage) {
                if (nextPage === null || pageNum < nextPage) {
                    nextPage = pageNum;
                }
            }
        });
    }
    
    // Check for next arrow if no specific page found
    if (nextPage === null) {
        let nextArrow = doc.select('li.pagination__arrow.pagination__item a[data-url]:last-child');
        if (nextArrow && nextArrow.size() > 0) {
            let nextUrl = nextArrow.attr('data-url');
            let match = nextUrl.match(/page=(\d+)/);
            if (match && parseInt(match[1]) > currentPage) {
                nextPage = parseInt(match[1]);
            }
        }
    }
    
    // Return with pagination if enabled or if we found a next page
    if (enablePagination && nextPage) {
        return Response.success(chapters, nextPage.toString());
    }
    
    return Response.success(chapters);
}