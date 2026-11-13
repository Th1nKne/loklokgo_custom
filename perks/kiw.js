let body = $response.body;

if (body) {
    try {
        let obj = JSON.parse(body);
        
        if (obj.data) {
            // Các trường cơ bản của VIP
            obj.data.tier = 1;
            obj.data.premium = 1;
            obj.data.expireTier = 4092599349000; // Năm 2099
            
            // Bổ sung thêm để đề phòng app check
            obj.data.level = 99;
            obj.data.groupId = 99;
            obj.data.totalTime = 999999999; // Thời gian dùng
        }
        
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        // Nếu parse lỗi thì trả về nguyên bản
        $done({});
    }
} else {
    $done({});
}
