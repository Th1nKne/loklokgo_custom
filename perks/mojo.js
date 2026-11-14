try {
    var bodyString = typeof $response.body === "string" 
        ? $response.body 
        : new TextDecoder("utf-8").decode($response.body);

    var obj = JSON.parse(bodyString);

    // Đảm bảo object subscriber tồn tại trước khi gán
    if (!obj.subscriber) {
        obj.subscriber = {};
    }

    obj.subscriber.entitlements = {
        "pro": {
            "expires_date": "9999-05-26T05:05:04Z",
            "product_identifier": "video.mojo.pro.yearly",
            "purchase_date": "2022-04-09T05:05:04Z"
        }
    }; // Đã sửa dấu phẩy thành dấu chấm phẩy tại đây
      
    obj.subscriber.subscriptions = {
        "video.mojo.pro.yearly": {
            "billing_issues_detected_at": null,
            "expires_date": "9999-05-26T05:05:04Z",
            "is_sandbox": false,
            "original_purchase_date": "2022-04-09T05:05:04Z",
            "period_type": "normal",
            "purchase_date": "2022-04-09T05:05:04Z",
            "store": "app_store",
            "unsubscribe_detected_at": null
        }
    };

    $done({ body: JSON.stringify(obj) });
} catch (e) {
    console.log("Mojo Script Error: " + e);
    $done({});
}
