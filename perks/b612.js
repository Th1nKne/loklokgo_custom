if ($request.url.indexOf("/status") === -1) {
    $done({});
} else {
    try {
        var bodyString = typeof $response.body === "string" ? $response.body : new TextDecoder("utf-8").decode($response.body);
        var obj = JSON.parse(bodyString);
        if (obj.result) {
            obj.result = {
                "activated": true,
                "products": [{
                    "productId": "com.campmobile.snowcamera.vip.oneyear",
                    "startDate": 1656472739000,
                    "expireDate": 253402300799000,
                    "managed": false,
                    "status": "ACTIVE"
                }]
            };
        }
        $done({ body: JSON.stringify(obj) });
    } catch(e) { $done({}); }
}
