function execute() {
    return Response.success([
            {title: "Truyện Mới", input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-moi?page={1}", script:"source.js"},
            {title: "Truyện Hot", input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-hot?page={1}", script:"source.js"},
            {title: 'Truyên Full', input: "https://www.tvtruyen.com/the-loai/tat-ca/truyen-full?page={1}", script:"source.js"}
    ]);
}