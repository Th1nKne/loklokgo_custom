/**
 * Picsart Premium Spoof
 * Type: http-response
 * Target: api.picsart.com
 */

const url = $request.url;
let body = null;

// /gw-v2/guard/credits
if (url.includes('/gw-v2/guard/credits')) {
  body = {
    status: "success",
    response: {
      period: "weekly",
      credits: 9999,
      initialCredits: 0,
      addonCredits: 0,
      tierCredits: 9999,
      creditsUnrounded: 0,
      addonCreditsUnrounded: 0,
      renewDate: "2027-11-25T06:15:59.400Z"
    }
  };
}

// /gw-v2/shop/subscription/owner/info
else if (url.includes('/gw-v2/shop/subscription/owner/info')) {
  body = {
    status: "success",
    response: {
      granted: true,
      is_valid: true
    }
  };
}

// /gw-v2/guard/users/order
else if (url.includes('/gw-v2/guard/users/order')) {
  body = {
    status: "success",
    response: {
      tier: {
        id: "gold",
        level: 2000,
        permissions: [
          "premium_tools_standard",
          "premium_tools_ai",
          "ai_avatar_generation",
          "ai_image_generation"
        ],
        storage_limit_in_mb: 20480,
        device_limit: 5
      },
      additionalInfo: {
        scopeTrialEligibility: [
          {
            scopeId: "mobile_web_pro_packages",
            canUseTrial: false
          }
        ]
      }
    }
  };
}

// /gw-v2/shop/subscription/apple/purchases
else if (url.includes('/gw-v2/shop/subscription/apple/purchases')) {
  body = {
    status: "success",
    response: [
      {
        status: "SUBSCRIPTION_RENEWED",
        is_trial: false,
        order_id: "2000001108782321",
        expire_date: 32662137600000,
        purchase_date: 1704758400000,
        subscription_id: "com.picsart.studio.subscription_pro_3_yearly",
        original_order_id: "2000000756285050",
        plan_meta: {
          permissions: [
            "premium_tools_standard",
            "premium_tools_ai"
          ],
          auto_renew_product_id: "com.picsart.studio.subscription_mac_tier1_pro_yearly",
          level: 2000,
          storage_limit_in_mb: 102400,
          id: "com.picsart.studio.subscription_pro_3_yearly",
          frequency: "yearly",
          type: "renewable",
          scope_id: "full",
          product_id: "com.picsart.studio.subscription_pro_3_yearly",
          tier_id: "pro"
        },
        limitation: {
          max_count: 10,
          limits_exceeded: false
        },
        is_eligible_for_introductory: false,
        reason: "ok"
      }
    ]
  };
}

// /gw-v2/cloud-storage/v1/me/storages  AND  /cloud-storage/v1/me/storages
else if (url.includes('/cloud-storage/v1/me/storages')) {
  body = {
    status: "success",
    response: {
      totalStorageSizeInBytes: 0,
      storageLimitSizeInBytes: 107374182400,
      foldersCountLimit: -1,
      totalFoldersCount: 0,
      totalFilesCount: 0
    }
  };
}

if (body) {
  $done({
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
} else {
  $done({});
}
