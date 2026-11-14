if ($request.url.indexOf("/status") === -1) {
    $done({}); // Bỏ qua nếu không phải endpoint check VIP
} else {
    try {
        var bodyString = typeof $response.body === "string" ? $response.body : new TextDecoder("utf-8").decode($response.body);
        var bachiep = JSON.parse(bodyString);
        bachiep.result = {
            "products" : [{
                "managed" : false,
                "status" : "CANCELLED",
                "startDate" : 1673222400000,
                "productId" : "com.snowcorp.soda.subscribe.oneyear",
                "expireDate" : 32662137600000
            }],
            "activated" : true
        };
        $done({body: JSON.stringify(bachiep)});
    } catch(e) { $done({}); }
}
