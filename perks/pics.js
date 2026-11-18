let url = $request.url;
let body = $response.body;
let obj = {};

// Parse body hiện tại (nếu có)
try {
    obj = JSON.parse(body || "{}");
} catch (e) {
    // Bỏ qua lỗi parse
}

// 1. Phá Cache (Chặn 304 Not Modified, trả về 200 để ép app load data mới)
if (url.includes("/guard/credits") || url.includes("/guard/users/tier")) {
    $done({ status: 200, body: body });
}

// 2. Bypass Purchases (Gán trực tiếp JSON)
if (url.includes("/shop/subscription/apple/purchases")) {
    obj = {
        "status": "success",
        "response": [{
            "status": "SUBSCRIPTION_RENEWED",
            "is_trial": false,
            "order_id": "2000001108782321",
            "expire_date": 32662137600000, // Timestamp năm 3004, tương đương vĩnh viễn
            "purchase_date": 1704758400000,
            "subscription_id": "com.picsart.studio.subscription_pro_3_yearly",
            "plan_meta": { "id": "com.picsart.studio.subscription_pro_3_yearly", "frequency": "yearly", "tier_id": "pro" },
            "reason": "ok"
        }]
    };
    $done({ status: 200, body: JSON.stringify(obj) });
}

// 3. Fake API Guard Quyền AI & Tier (Gán trực tiếp JSON)
if (url.includes("/gw-v2/guard/users/order")) {
    obj = {
        "status": "success",
        "response": {
            "tier": {
                "id": "gold",
                "level": 2000,
                "permissions": ["premium_tools_standard", "premium_tools_ai", "ai_avatar_generation", "ai_image_generation"],
                "storage_limit_in_mb": 20480,
                "device_limit": 5
            },
            "additionalInfo": { "scopeTrialEligibility": [{"scopeId": "mobile_web_pro_packages", "canUseTrial": false}] }
        }
    };
    $done({ status: 200, body: JSON.stringify(obj) });
}

// 4. Fake Cloud Storage 100GB (Gán trực tiếp JSON)
if (url.includes("/cloud-storage/v1/me/storages")) {
    obj = {
        "response": { "totalStorageSizeInBytes": 0, "storageLimitSizeInBytes": 107374182400, "foldersCountLimit": -1, "totalFoldersCount": 0 },
        "status": "success"
    };
    $done({ status: 200, body: JSON.stringify(obj) });
}

// 5. Bypass Check Owner Info (Gán trực tiếp JSON)
if (url.includes("/shop/subscription/owner/info")) {
    obj = { "status": "success", "response": { "granted": true, "is_valid": true } };
    $done({ status: 200, body: JSON.stringify(obj) });
}

// 6. Hack All AI Tools giá 0 Credit (Can thiệp động vào response server)
if (url.includes("/shop/subscription/features")) {
    if (obj.response && Array.isArray(obj.response)) {
        obj.response.forEach(item => {
            item.credit_price = 0;
            item.otpForUnsubscribedUsers = false;
        });
    }
    $done({ status: 200, body: JSON.stringify(obj) });
}

// 7. Bypass Webhook Magic Flow AI (Can thiệp động, set mọi phí = 0)
if (url.includes("/workflows/magic-flow-webhook/options")) {
    if (obj.response) {
        obj.response.chargeCredits = false;
        obj.response.credits = 0;
        obj.response.usageAmount = 0;
        obj.response.price = 0;
    }
    $done({ status: 200, body: JSON.stringify(obj) });
}

// Fallback: Trả về nguyên gốc cho các request không nằm trong danh sách trên
$done({});
