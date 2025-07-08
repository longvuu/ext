function execute() {
    return Response.success([
        //https://www.69shuba.com/novels/newhot_0_0_1.htm
        {title: "Sách mới", input: "/novels/newhot_0_0_{0}.htm", script: "gen.js"},
        {title: "Phổ biến", input: "/novels/monthvisit_0_0_{0}.htm", script: "gen.js"},
        {title: "Phổ biến toàn bộ", input: "/novels/monthvisit_0_1_{0}.htm", script: "gen.js"},
        {title: "Đề cử", input: "/novels/allvote_0_0_{0}.htm", script: "gen.js"},
        {title: "Cập nhật mới nhất", input: "/last", script: "update.js"},
        {title: "Đề cử nam", input: "/novels/male", script: "gen.js"},
        {title: "Đề cử nữ", input: "/novels/female", script: "gen.js"},
        {title: "Tất cả thể loại", input: "/novels/full/0/{0}.htm", script: "gen.js"},
    ]);
}