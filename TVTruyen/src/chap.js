function execute(url) {

    let response = fetch(url);
    if (response.ok) {
        let doc = response.html();
        return Response.success(doc.select("#chapter-content").html());
    }
    return null;
}