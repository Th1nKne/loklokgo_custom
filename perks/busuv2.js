var body = $response.body;
var obj = JSON.parse(body);

if (obj.data) {
    // 1. Nâng cấp tier lên gói cao nhất hiện tại theo API v2
    obj.data.access = { 
        "tier": "premium_plus" 
    };
    
    // 2. Bật cờ Premium tổng
    obj.data.is_premium = true;

    // 3. Fake thông tin gói cước để qua mặt check nội bộ của app
    if (obj.data.premium_data) {
        obj.data.premium_data.subscription_status = "active";
        obj.data.premium_data.product = "tiers_v2_plus";
        obj.data.premium_data.platform = "apple";
        obj.data.premium_data.expiration = 4102444800; // Năm 2099
    }
}

$done({ body: JSON.stringify(obj) });
