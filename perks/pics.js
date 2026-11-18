/*
 * Picsart VIP & AI Unlocker - Advanced Shadowrocket / Surge Script
 * Bypasses token errors, spoofs 200 OK, zeros out AI costs, and forces Pro status.
 */

const url = $request.url;
let body = $response.body;

// Force a successful base state
let statusCode = 200;

// The full VIP subscription payload mimicking a lifetime Pro tier
const vipPayload = {
    "status": "success",
    "response": {
        "granted": true,
        "is_valid": true,
        "subscription": {
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
            "limitation": {
                "max_count": 9999,
                "limits_exceeded": false
            },
            "is_eligible_for_introductory": false,
            "reason": "ok"
        }
    }
};

try {
    // 1. Hijack the Subscription/Owner info
    if (url.includes("owner/info") || url.includes("users/order") || url.includes("apple/purchases")) {
        body = JSON.stringify(vipPayload);
    } 
    // 2. Hijack Credits to show infinite
    else if (url.includes("credits")) {
        body = JSON.stringify({
            "status": "success",
            "response": {
                "credits": 999999,
                "is_unlimited": true
            }
        });
    } 
    // 3. Hijack AI Costs - dynamically parse and zero out prices
    else if (url.includes("cost")) {
        let parsed = JSON.parse(body);
        if (parsed && parsed.response && Array.isArray(parsed.response)) {
            // Loop through the massive AI array and force everything to free
            parsed.response = parsed.response.map(item => {
                item.credit_price = 0;
                item.otpForUnsubscribedUsers = false;
                return item;
            });
            body = JSON.stringify(parsed);
        } else {
            // Fallback if the structure is weird
            body = JSON.stringify({
                "status": "success",
                "response": [{ "id": "default", "credit_price": 0, "otpForUnsubscribedUsers": false }]
            });
        }
    } 
    // 4. Catch-all for the token errors in Safari/App
    else {
        // If the server threw a token error, completely overwrite it with a fake success
        if (body.includes("token_error") || body.includes("invalid")) {
            body = JSON.stringify({ "status": "success", "response": { "granted": true, "is_valid": true } });
        }
    }
} catch (e) {
    // If JSON parsing dies, just return a safe success payload
    body = JSON.stringify({ "status": "success", "response": { "granted": true, "is_valid": true } });
}

// Force the status code to 200 and send the modified body
$done({ status: statusCode, body: body });
