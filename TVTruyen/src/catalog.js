load('config.js');

function execute() {
    return Response.success([
        {
            title: "Thể Loại",
            script: "genre.js"
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
            title: "Truyện VIP",
            input: BASE_URL + "/truyen-vip",
            script: "gen.js"
        },
        {
            title: "Sắp Xếp Theo",
            input: BASE_URL,
            script: "sort.js"
        }
    ]);
}