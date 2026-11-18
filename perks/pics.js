let url = $request.url;
let body = $response.body;
let obj;

try {
    obj = JSON.parse(body);
} catch (e) {
    $done({});
}

// 1. cloud-storage/v1/me/storages -> storage.json
if (url.includes("/cloud-storage/v1/me/storages")) {
    obj = {
        "response": {
            "totalStorageSizeInBytes": 0,
            "storageLimitSizeInBytes": 107374182400,
            "foldersCountLimit": -1,
            "totalFoldersCount": 0,
            "totalFilesCount": 0
        },
        "status": "success"
    };
}
// 2. shop/subscription/apple/purchases -> a_picsart2.json
else if (url.includes("/shop/subscription/apple/purchases")) {
    obj = {
        "status": "success",
        "response": [
            {
                "status": "SUBSCRIPTION_RENEWED",
                "is_trial": false,
                "order_id": "2000001108782321",
                "expire_date": 32662137600000,
                "purchase_date": 1704758400000,
                "subscription_id": "com.picsart.studio.subscription_pro_3_yearly",
                "original_order_id": "2000000756285050",
                "plan_meta": {
                    "permissions": ["premium_tools_standard", "premium_tools_ai"],
                    "auto_renew_product_id": "com.picsart.studio.subscription_mac_tier1_pro_yearly",
                    "level": 2000,
                    "storage_limit_in_mb": 102400,
                    "id": "com.picsart.studio.subscription_pro_3_yearly",
                    "frequency": "yearly",
                    "type": "renewable",
                    "scope_id": "full",
                    "product_id": "com.picsart.studio.subscription_pro_3_yearly",
                    "tier_id": "pro"
                },
                "limitation": { "max_count": 10, "limits_exceeded": false },
                "is_eligible_for_introductory": false,
                "reason": "ok"
            }
        ]
    };
}
// 3. owner/info hoặc features -> a_owner.json
else if (url.includes("/shop/subscription/owner/info") || url.includes("/shop/subscription/features")) {
    obj = {
        "status": "success",
        "response": { "granted": true, "is_valid": true }
    };
}
// 4. users/tier hoặc users/order -> a_guard.json
else if (url.includes("/guard/users/tier") || url.includes("/guard/users/order")) {
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
            "additionalInfo": {
                "scopeTrialEligibility": [{ "scopeId": "mobile_web_pro_packages", "canUseTrial": false }]
            }
        }
    };
}
// 5. guard/credits -> a_cost_ai.json (Xử lý Mảng)
else if (url.includes("/guard/credits")) {
    if (obj.response && Array.isArray(obj.response)) {
        obj.response.forEach(item => {
            if (item.hasOwnProperty("credit_price")) {
                item.credit_price = 0;
                item.otpForUnsubscribedUsers = false;
            }
        });
    }
}
// 6. workflows/magic-flow-webhook/options (Xử lý Object chặn trừ credit)
else if (url.includes("/workflows/magic-flow-webhook/options")) {
    if (obj.response) {
        obj.response.credits = 0;
        obj.response.usageAmount = 0;
        obj.response.chargeCredits = false;
    }
}

$done({ body: JSON.stringify(obj) });
