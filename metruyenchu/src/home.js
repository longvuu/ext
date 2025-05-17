function execute() {
    return Response.success([
            {title: "Truyện Mới", input: "https://metruyenchu.net/danh-sach/truyen-moi", script:"source.js"},
            {title: "Truyện Sắc", input: "https://metruyenchu.net/the-loai/sac", script:"source.js"},
    ]);
}