load('config.js');

function execute(url) {
    url = url.replace(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n?]+)/img, BASE_URL);
    
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let novelList = [];
        
        doc.select(".related-stories .story-item").forEach(e => {
            novelList.push({
                name: e.select(".story-title a").text(),
                link: e.select(".story-title a").first().attr("href"),
                description: e.select(".chapter-latest a").text() || "Chương mới nhất",
                cover: e.select(".story-cover img").first().attr("src"),
                host: BASE_URL
            });
        });
        
        return Response.success(novelList);
    }
    
    return null;
}