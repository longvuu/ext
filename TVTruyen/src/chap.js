load('config.js');
function execute(url) {
    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        // Tìm cdnUrl trong các thẻ script
        let cdnUrl = null;
        doc.select("script").forEach(script => {
            let html = script.html();
            if (html && html.indexOf("cdnUrl") !== -1) {
                let match = /cdnUrl\s*:\s*['"]([^'"]+)['"]/.exec(html);
                if (match) {
                    cdnUrl = match[1];
                }
            }
        });

        if (cdnUrl) {
            let cdnResponse = fetch(cdnUrl);
            if (cdnResponse.ok) {
                return Response.success(cdnResponse.text());
            }
        }
        return Response.success(doc.select("#chapter-content").html());
    }
    return null;
}