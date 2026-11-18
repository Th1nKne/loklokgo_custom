const url = $request.url;
let obj = null;

// Xử lý nhánh động nếu là http-response (dành cho endpoint cost)
if (typeof $response !== "undefined") {
  try {
    let bodyObj = JSON.parse($response.body);
    if (bodyObj && Array.isArray(bodyObj.response)) {
      bodyObj.status = "success";
      bodyObj.response = bodyObj.response.map(item => ({
        ...item,
        credit_price: 0,
        otpForUnsubscribedUsers: false
      }));
      $done({ body: JSON.stringify(bodyObj) });
    } else {
      $done({});
    }
  } catch (e) {
    $done({});
  }
} else {
  // Xử lý Map Local ở tầng http-request (chặn trước khi lên server, y hệt Charles)
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
  }

  if (obj !== null) {
    // Cú pháp chuẩn của http-request để trả về mock response ngay lập tức
    $done({
      response: {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE",
          "Access-Control-Allow-Headers": "*"
        },
        body: JSON.stringify(obj)
      }
    });
  } else {
    $done({});
  }
}
