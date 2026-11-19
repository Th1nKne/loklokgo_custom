// pics.js - Tối ưu riêng cho Shadowrocket
const url = $request.url;
const isResponse = typeof $response !== "undefined";
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
      "renewDate": "2029-11-25T06:15:59.400Z"
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
} else if (url.includes("apple/purchases")) {
  // http-response layer — override response từ server
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
        "limitation": {"max_count": 10, "limits_exceeded": false},
        "is_eligible_for_introductory": false,
        "reason": "ok"
      }
    ]
  };
} else if (url.includes("/me/storages") || url.includes("cloud-storage")) {
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
  if (isResponse && $response.body) {
    try {
      let parsed = JSON.parse($response.body);
      if (parsed && Array.isArray(parsed.response)) {
        parsed.status = "success";
        parsed.response = parsed.response.map(item => ({
          ...item,
          credit_price: 0,
          otpForUnsubscribedUsers: false
        }));
        obj = parsed;
      }
    } catch (e) {}
  }
  if (!obj) {
    obj = {
      "status": "success",
      "response": [
        { "id": "object_remove", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "background_remove", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "ai_replace", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "ai_expand", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "gen_ai_bg", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "text_to_image", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "quality_fix_enhance_upscale", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "quality_fix_enhance", "credit_price": 0, "otpForUnsubscribedUsers": false },
        { "id": "quality_fix_upscale", "credit_price": 0, "otpForUnsubscribedUsers": false }
      ]
    };
  }
}

if (obj !== null) {
  const bodyStr = JSON.stringify(obj);
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
    "Access-Control-Allow-Headers": "*"
  };

  // tất cả đều dùng $response format vì giờ purchases cũng là http-response
  if (isResponse) {
    $done({
      status: 200,
      headers: Object.assign({}, $response.headers || {}, headers),
      body: bodyStr
    });
  } else {
    // http-request (guard/credits, owner/info, users/order, storages)
    $done({
      response: {
        status: 200,
        headers: headers,
        body: bodyStr
      }
    });
  }
} else {
  $done({});
}
