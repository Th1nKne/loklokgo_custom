var bodyString = typeof $response.body === "string" 
    ? $response.body 
    : new TextDecoder("utf-8").decode($response.body);
var url = $request.url;

// 1. Xử lý endpoint lấy thông tin gói cước (/me/subscriptions)
if (url.indexOf("/subscriptions") !== -1) {
    var subObj = {
        "is_pro": true,
        "on_hold": false,
        "pending": false,
        "renewing": false,
        "expiry_date": "9999-12-31T23:59:59Z",
        "subscription_type": "LIFETIME",
        "payment_method": "STRIPE"
    };
    $done({ body: JSON.stringify(subObj) });
} 
// 2. Xử lý endpoint lấy thông tin user gốc (/me)
else {
    try {
        var obj = JSON.parse(bodyString);
        var userProfile = obj.profile ? obj.profile : obj;

        userProfile.is_pro = true;
        userProfile.has_lapsed_pro = false;

        userProfile.subscription = {
            "expiry": "9999-12-31T23:59:59Z",
            "is_active": false,
            "is_on_hold": false,
            "subscription_type": 10
        };

        if (obj.profile) {
            obj.profile = userProfile;
        } else {
            obj = userProfile;
        }

        $done({ body: JSON.stringify(obj) });
    } catch(e) {
        $done({});
    }
}
