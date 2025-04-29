function execute() {
    return Response.success([
        {
            title: "Truyện Mới", input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-moi", script:"source.js",
            title: "Truyện Hot", input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-hot", script:"source.js",
            title: 'Truyên Full', input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-full", script:"source.js",
        },
    ]);
}