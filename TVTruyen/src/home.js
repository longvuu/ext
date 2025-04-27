load('config.js');

function execute() {
    return Response.success([
        {
            title: "Thể Loại",
            script: "genre.js"
        },
        {
            title: "Danh Mục",
            script: "catalog.js"
        },
        {
            title: "Truyện Mới Cập Nhật",
            input: BASE_URL + "/truyen-moi",
            script: "gen.js"
        },
        {
            title: "Truyện Hot",
            input: BASE_URL + "/truyen-hot",
            script: "gen.js"
        },
        {
            title: "Truyện Full",
            input: BASE_URL + "/truyen-full",
            script: "gen.js"
        },
        {
            title: "Tìm Kiếm",
            input: BASE_URL,
            script: "search.js"
        }
    ]);
}