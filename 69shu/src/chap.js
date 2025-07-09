function execute(url) {
    try {
        let response = fetch(url);
        
        // Check if response exists and has content
        if (!response) {
            return Response.error("Không thể kết nối đến server");
        }
        
        if (response.ok) {
            let doc = response.html();
            
            if (!doc) {
                return Response.error("Không thể parse HTML");
            }
            
            // Get the chapter content from .txtnav div
            let contentDiv = doc.select(".txtnav");
            if (contentDiv && contentDiv.html()) {
                // Remove script tags and ads
                contentDiv.select("script").remove();
                contentDiv.select(".contentadv").remove();
                contentDiv.select("#txtright").remove();
                
                // Get the chapter title
                let title = contentDiv.select("h1").first();
                let titleText = title ? title.text() : "";
                
                // Get the chapter info
                let info = contentDiv.select(".txtinfo").first();
                let infoText = info ? info.text() : "";
                
                // Remove title and info elements to get only content
                contentDiv.select("h1").remove();
                contentDiv.select(".txtinfo").remove();
                
                // Get the actual chapter content
                let content = contentDiv.html();
                
                // Clean up the content
                if (content && content.trim().length > 0) {
                    // Add title back to content if it exists
                    if (titleText && titleText.trim().length > 0) {
                        content = "<h2>" + titleText + "</h2>" + content;
                    }
                    
                    return Response.success(content.trim());
                }
            }
            
            return Response.error("Không thể tìm thấy nội dung chương");
        } else {
            return Response.error("Lỗi HTTP: " + response.status);
        }
    } catch (error) {
        return Response.error("Lỗi: " + error.message);
    }
}