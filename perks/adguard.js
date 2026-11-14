if ($request.url.indexOf("ios_validate_receipt") === -1) {
    $done({});
} else {
    try {
        var bodyString = typeof $response.body === "string" ? $response.body : new TextDecoder("utf-8").decode($response.body);
        var obj = JSON.parse(bodyString);
        obj.products = [{
            "product_id": "com.adguard.lifetimePurchase",
            "premium_status": "ACTIVE"
        }];
        $done({ body: JSON.stringify(obj) });
    } catch(e) { $done({}); }
}
