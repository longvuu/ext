load('config.js');

function execute(url) {
    // Directly fetch the chapter page from metruyenchu.net
    let response = fetch(url);
    
    if (response.ok) {
        let doc = response.html();
        
        // Extract the content from the content-chapter div
        let chapterContent = doc.select("#content-chapter");
        
        // Remove any unwanted elements (like ads or navigation)
        chapterContent.select("div[data-cl-spot]").remove();
        
        // Process the paragraphs if needed
        // In this case, the paragraphs already have proper formatting classes
        
        // Get the chapter title
        let chapterTitle = doc.select("h2 a").text();
        
        // Add the title to the content (optional)
        let content = "<h1>" + chapterTitle + "</h1>" + chapterContent.html();
        
        return Response.success(content);
    }
    
    return Response.error("Không thể tải nội dung chương. Vui lòng thử lại sau.");
}