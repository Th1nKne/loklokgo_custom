let url = $request.url;
let body = $response.body;
let obj = {};

try {
    obj = JSON.parse(body || "{}");
} catch (e) {
    // Bỏ qua nếu body trống hoặc lỗi
}

// 1. Phá Cache
if (url.includes("/guard/credits") || url.includes("/guard/users/tier")) {
    return $done({ status: 200, body: body });
}

// 2. Bypass Purchases
if (url.includes("/shop/subscription/apple/purchases")) {
    obj = {
        "status": "success",
        "response": [{
            "status": "SUBSCRIPTION_RENEWED",
            "is_trial": false,
            "order_id": "2000001108782321",
            "expire_date": 32662137600000,
            "purchase_date": 1704758400000,
            "subscription_id": "com.picsart.studio.subscription_pro_3_yearly",
            "original_order_id": "2000000756285050",
            "plan_meta": { "id": "com.picsart.studio.subscription_pro_3_yearly", "frequency": "yearly", "tier_id": "pro", "permissions": ["premium_tools_standard", "premium_tools_ai"] },
            "reason": "ok"
        }]
    };
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 3. Fake API Guard Quyền AI & Tier
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
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 4. Fake Cloud Storage
if (url.includes("/cloud-storage/v1/me/storages")) {
    obj = {
        "response": { "totalStorageSizeInBytes": 0, "storageLimitSizeInBytes": 107374182400, "foldersCountLimit": -1, "totalFoldersCount": 0 },
        "status": "success"
    };
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 5. Bypass Check Owner Info
if (url.includes("/shop/subscription/owner/info")) {
    obj = { "status": "success", "response": { "granted": true, "is_valid": true } };
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 6. Hack All AI Tools giá 0 Credit
if (url.includes("/shop/subscription/features")) {
    if (obj.response && Array.isArray(obj.response)) {
        obj.response.forEach(item => {
            item.credit_price = 0;
            item.otpForUnsubscribedUsers = false;
        });
    }
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 7. Bypass Webhook Magic Flow AI
if (url.includes("/workflows/magic-flow-webhook/options")) {
    if (obj.response) {
        obj.response.chargeCredits = false;
        obj.response.credits = 0;
        obj.response.usageAmount = 0;
        obj.response.price = 0;
    }
    return $done({ status: 200, body: JSON.stringify(obj) });
}

// 8. Fallback
return $done({});
