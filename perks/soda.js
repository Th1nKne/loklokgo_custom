try {
    var bodyString = typeof $response.body === "string" 
        ? $response.body 
        : new TextDecoder("utf-8").decode($response.body);

    var bachiep = JSON.parse(bodyString);
    var url = $request.url;

    // Chỉ chèn quyền lợi VIP nếu gọi vào endpoint trạng thái (status)
    if (url.indexOf("/status") !== -1) {
        bachiep.result = {
            "products" : [
                {
                    "managed" : false,
                    "status" : "CANCELLED",
                    "startDate" : 1673222400000,
                    "productId" : "com.snowcorp.soda.subscribe.oneyear",
                    "expireDate" : 32662137600000
                }
            ],
            "activated" : true
        };
    }
    // Các endpoint khác (như /list) sẽ giữ nguyên dữ liệu gốc để không bị lỗi hiển thị
    
    $done({body: JSON.stringify(bachiep)});
} catch (e) {
    // Nếu gặp lỗi parse hoặc lỗi khác, trả về bản gốc
    $done({});
}
