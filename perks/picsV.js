let url = $request.url;
let obj = null;

// 1. Storage 100GB -> storage.json
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
// 2. Purchases -> a_picsart2.json
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
// 3. Owner Info -> a_owner.json (Tách riêng, không gộp chung với features)
else if (url.includes("/shop/subscription/owner/info")) {
    obj = {
        "status": "success",
        "response": { "granted": true, "is_valid": true }
    };
}
// 4. Guard Tier & Order -> a_guard.json
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
// 5. Workflow Options -> a_workflow.json
else if (url.includes("/workflows/magic-flow-webhook/options")) {
    obj = {
        "status": "success",
        "response": {
            "monetization": { "toolId": "request.magicflow-webhook" },
            "usageAmount": 0,
            "chargeCredits": false,
            "toolId": "request.magicflow-webhook",
            "credits": 0,
            "unit": "generation",
            "price": 0,
            "estimated": false
        }
    };
}
// 6. Shop Features (Bảng giá AI) -> Sửa động từ response của server
else if (url.includes("/shop/subscription/features") && typeof $response !== "undefined") {
    try {
        let featObj = JSON.parse($response.body);
        if (featObj.response && Array.isArray(featObj.response)) {
            featObj.response.forEach(item => {
                item.credit_price = 0;
                item.otpForUnsubscribedUsers = false;
            });
        }
        $done({
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(featObj)
        });
    } catch (e) {
        $done({});
    }
}

// Nếu thuộc 5 API tĩnh ở trên: Trả thẳng HTTP 200 giống hệt Charles Map Local
if (obj !== null) {
    if (typeof $response !== "undefined") {
        // Khi chạy ở chế độ http-response
        $done({
            status: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });
    } else {
        // Khi chạy ở chế độ http-request (Chặn ngay lập tức như Map Local)
        $done({
            response: {
                status: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(obj)
            }
        });
    }
} else if (typeof $response === "undefined") {
    $done({});
}
