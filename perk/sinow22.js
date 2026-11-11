let obj = JSON.parse($response.body);

if (obj && obj.result) {
    obj.result.activated = true;
    obj.result.products = [
        {
            "managed": false,
            "status": "ACTIVE",
            "startDate": 1710428400000,
            "productId": "com.campmobile.snow.subscribe.oneyear",
            "expireDate": 4102412400000
        }
    ];
    obj.result.tickets = [
        {
            "managed": false,
            "status": "ACTIVE",
            "startDate": 1710428400000,
            "productId": "com.campmobile.snow.subscribe.oneyear",
            "expireDate": 4102412400000
        }
    ];
    obj.result.vipSegments = ["SUBSCRIPTION_PREMIER"];
    
    // Thử xóa sig xem client có cho qua khi thiếu chữ ký không
    delete obj.sig;
}

$done({ body: JSON.stringify(obj) });
