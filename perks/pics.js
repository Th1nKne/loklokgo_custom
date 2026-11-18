let url = $request.url;
let obj = null;

if (url.includes("/guard/credits")) {
  obj = {
    "status": "success",
    "response": {
      "period": "weekly",
      "credits": 9999,
      "initialCredits": 0,
      "addonCredits": 0,
      "tierCredits": 9999,
      "creditsUnrounded": 0,
      "addonCreditsUnrounded": 0,
      "renewDate": "2026-11-25T06:15:59.400Z"
    }
  };
} else if (url.includes("/owner/info")) {
  obj = {
    "status": "success",
    "response": {
      "granted": true,
      "is_valid": true
    }
  };
} else if (url.includes("/users/order")) {
  obj = {
    "status": "success",
    "response": {
      "tier": {
        "id": "gold",
        "level": 2000,
        "permissions": [
          "premium_tools_standard",
          "premium_tools_ai",
          "ai_avatar_generation",
          "ai_image_generation"
        ],
        "storage_limit_in_mb": 20480,
        "device_limit": 5
      },
      "additionalInfo": {
        "scopeTrialEligibility": [
          {
            "scopeId": "mobile_web_pro_packages",
            "canUseTrial": false
          }
        ]
      }
    }
  };
} else if (url.includes("/apple/purchases")) {
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
          "permissions": [
            "premium_tools_standard",
            "premium_tools_ai"
          ],
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
        "limitation": {
          "max_count": 10,
          "limits_exceeded": false
        },
        "is_eligible_for_introductory": false,
        "reason": "ok"
      }
    ]
  };
} else if (url.includes("/me/storages")) {
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
} else if (url.includes("cost")) {
  try {
    let raw = JSON.parse($response.body);
    if (raw && Array.isArray(raw.response)) {
      raw.status = "success";
      raw.response.forEach(item => {
        item.credit_price = 0;
      });
      obj = raw;
    }
  } catch (e) {}
  
  // Nếu bạn vẫn muốn dùng mảng tĩnh 3.500 dòng như file cũ, có thể gán trực tiếp obj = { ... } tại đây
}

// Chỉ ghi đè khi URL khớp chính xác một trong các nhánh trên
if (obj !== null) {
  $done({
    status: 200,
    headers: Object.assign($response.headers || {}, {
      "Content-Type": "application/json; charset=utf-8"
    }),
    body: JSON.stringify(obj)
  });
} else {
  $done({});
}
