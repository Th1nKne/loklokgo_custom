var body = $response.body;
var obj = JSON.parse(body);

if (obj && obj.customerInfo && obj.customerInfo.entitlements) {
    // Duyệt qua các gói quyền lợi và kích hoạt Premium
    for (var i = 0; i < obj.customerInfo.entitlements.length; i++) {
        if (obj.customerInfo.entitlements[i].identifier === "Premium") {
            obj.customerInfo.entitlements[i].isActive = true;
            // (Tùy chọn) Có thể set thêm isLifetime = true để tránh check hạn
            // obj.customerInfo.entitlements[i].isLifetime = true;
        }
    }
}

body = JSON.stringify(obj);
$done({ body: body });
