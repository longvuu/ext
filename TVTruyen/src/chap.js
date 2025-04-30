function execute(url) {

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        let cdnUrl = null;

        // Duyệt qua tất cả các thẻ script để tìm cdnUrl
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
    }
    return null;
}