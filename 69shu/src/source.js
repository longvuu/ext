load("config.js");

function execute(url, page) {
    let nextPage = 1;
    
    // Extract page number from different URL patterns
    let pageMatch = url.match(/_(\d+)\.htm/);  // For _4.htm pattern
    let topindexMatch = url.match(/\/ajax_topindex\/(\d+)/);  // For /ajax_topindex/4 pattern
    let regularTopindexMatch = url.match(/\/topindex\/(\d+)/);  // For /topindex/4 pattern
    
    if (pageMatch) {
        nextPage = parseInt(pageMatch[1], 10);
    } else if (topindexMatch) {
        nextPage = parseInt(topindexMatch[1], 10);
    } else if (regularTopindexMatch) {
        nextPage = parseInt(regularTopindexMatch[1], 10);
    }
    
    // Nếu là ajax_novels hoặc ajax_topindex thì cần gửi thêm header X-Requested-With
    let headers = {};
    if (url.indexOf('/ajax_novels/') > -1 || url.indexOf('/ajax_topindex/') > -1) {
        headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    let response = fetch(url, { headers: headers });
    if (!response.ok) {
        return Response.error("Không thể tải danh sách truyện. Vui lòng thử lại sau.");
    }
    // Nếu là ajax_novels và trả về JSON, lấy data/data2
    if (url.indexOf('/ajax_novels/') > -1 && response.contentType && response.contentType().indexOf('application/json') !== -1) {
        let json = response.json();
        if (!json || !json.data) {
            return Response.error("Không thể lấy danh sách truyện. Vui lòng thử lại sau.");
        }
        let books = json.data.map(item => ({
            name: item.name,
            link: item.link,
            cover: item.cover,
            author: item.author,
            description: item.description,
            host: item.host
        }));
        let nextUrl = json.data2 || null;
        return Response.success(books, nextUrl);
    }
    
    // Parse HTML for both regular pages and ajax_topindex pages (which return HTML, not JSON)
    let doc = response.html();
    let books = [];
    
    // Function to extract books from a document
    function extractBooksFromDoc(document) {
        let extractedBooks = [];
        document.select('#article_list_content > li').forEach(e => {
            let aTag = e.select('h3 a');
            let name = aTag.text();
            let link = aTag.attr('href');
            if (link && !link.startsWith('http')) link = BASE_URL.replace(/\/$/, '') + link;
            let cover = e.select('.imgbox img').attr('data-src') || e.select('.imgbox img').attr('src') || '';
            if (cover && !cover.startsWith('http')) cover = BASE_URL.replace(/\/$/, '') + cover;
            let author = e.select('.labelbox label').first().text();
            let description = e.select('ol').text();
            extractedBooks.push({
                name: name,
                link: link,
                cover: cover,
                author: author,
                description: description,
                host: BASE_URL
            });
        });
        return extractedBooks;
    }
    
    // Nếu là ajax_topindex, chỉ trả về books của 1 trang hiện tại, nextPage là số trang tiếp theo (theo style src1/gen2.js)
    if (url.indexOf('/ajax_topindex/') > -1) {
        books = extractBooksFromDoc(doc);
        // Lấy số trang tiếp theo từ phân trang HTML
        let nextPageText = doc.select('div.pagelink strong + a').text().trim();
        let nextPage = nextPageText !== '' ? nextPageText : null;
        return Response.success(books, nextPage);
    } else {
        // Extract books from current page (for non-ajax_topindex)
        books = books.concat(extractBooksFromDoc(doc));
    }
    let nextUrl = null;
    if (url.indexOf('/ajax_topindex/') === -1) {
        // Check if we have enough books to suggest there might be more pages (chỉ cho non-ajax_topindex)
        if (books.length >= 20) {
            // Extract current page number from URL
            let currentPage = nextPage;
            let nextPageNum = currentPage + 1;
            // Build next page URL based on current URL pattern
            let testNextUrl;
            if (url.indexOf('/ajax_novels/') > -1) {
                // For ajax_novels URLs, increment the page number in the filename
                testNextUrl = url.replace(/_(\d+)\.htm/, function(_, n) { 
                    return '_' + nextPageNum + '.htm'; 
                });
            } else {
                // For regular URLs, try to convert to ajax format
                if (url.indexOf('/topindex/') > -1) {
                    testNextUrl = url.replace(/\/topindex\/(\d+)/, '/ajax_topindex/' + nextPageNum);
                } else {
                    testNextUrl = url.replace(/\/novels\//, '/ajax_novels/');
                    testNextUrl = testNextUrl.replace(/_(\d+)\.htm/, function(_, n) { 
                        return '_' + nextPageNum + '.htm'; 
                    });
                }
            }
            // Test if next page exists by making a request
            try {
                let testHeaders = {};
                if (testNextUrl.indexOf('/ajax_') > -1) {
                    testHeaders['X-Requested-With'] = 'XMLHttpRequest';
                }
                let testResponse = fetch(testNextUrl, { headers: testHeaders });
                if (testResponse.ok) {
                    // Check if the response has content
                    if (testNextUrl.indexOf('/ajax_novels/') > -1 && testResponse.contentType && testResponse.contentType().indexOf('application/json') !== -1) {
                        // Handle JSON response for ajax_novels
                        let testJson = testResponse.json();
                        if (testJson && testJson.data && testJson.data.length > 0) {
                            nextUrl = testNextUrl;
                        }
                    } else {
                        // Handle HTML response for regular pages
                        let testDoc = testResponse.html();
                        let testBooks = testDoc.select('#article_list_content > li');
                        if (testBooks && testBooks.html() && testBooks.html().trim().length > 0) {
                            nextUrl = testNextUrl;
                        }
                    }
                }
            } catch (e) {
                // If test fails, fallback to simple increment
                if (url.indexOf('/ajax_novels/') > -1) {
                    nextUrl = url.replace(/_(\d+)\.htm/, '_' + nextPageNum + '.htm');
                } else {
                    nextUrl = url.replace(/\/novels\//, '/ajax_novels/');
                    nextUrl = nextUrl.replace(/_(\d+)\.htm/, function(_, n) { 
                        return '_' + (parseInt(n, 10) + 1) + '.htm'; 
                    });
                }
            }
        }
        return Response.success(books, nextUrl);
    }
}