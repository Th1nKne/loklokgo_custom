var body = $response.body;
var obj = JSON.parse(body);

// Xử lý linh hoạt trường hợp JSON có hoặc không có thẻ bọc "profile"
var userProfile = obj.profile ? obj.profile : obj;

// Kích hoạt cờ Pro
userProfile.is_pro = true;
userProfile.has_lapsed_pro = false;

// Đè thông tin gói Lifetime
userProfile.subscription = {
    "expiry": "9999-12-31T23:59:59Z",
    "is_active": false, // Trạng thái gói vĩnh viễn không phải là subscription gia hạn
    "is_on_hold": false,
    "subscription_type": 10 // Mã định danh gói Lifetime của Memrise
};

if (obj.profile) {
    obj.profile = userProfile;
} else {
    obj = userProfile;
}

$done({ body: JSON.stringify(obj) });
