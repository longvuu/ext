load('config.js');

function execute() {
    return Response.success([
        {
            title: "Mới Cập Nhật",
            input: BASE_URL + "/truyen-moi",
            script: "gen.js"
        },
        {
            title: "Xem Nhiều",
            input: BASE_URL + "/truyen-hot",
            script: "gen.js"
        },
        {
            title: "Hoàn Thành",
            input: BASE_URL + "/truyen-full",
            script: "gen.js"
        },
        {
            title: "Đánh Giá Cao",
            input: BASE_URL + "/truyen-hay",
            script: "gen.js"
        },
        {
            title: "Mới Đăng",
            input: BASE_URL + "/truyen-moi-dang",
            script: "gen.js"
        }
    ]);
}