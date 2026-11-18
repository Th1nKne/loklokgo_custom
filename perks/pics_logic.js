let url = $request.url;
let body = $response.body;

// 1. Phá Cache 304 thành 200 cho các API Guard
if (url.indexOf("/guard/credits") !== -1 || url.indexOf("/guard/users/tier") !== -1 || url.indexOf("/guard/users/order") !== -1) {
    $done({ status: 200, body: body });
}

// 2. Bypass Webhook Magic Flow
if (url.indexOf("/workflows/magic-flow-webhook/options") !== -1) {
    let obj = JSON.parse(body || "{}");
    if (obj.response) {
        obj.response.chargeCredits = false; // Tắt cờ tính phí
        obj.response.credits = 0;           // Chi phí tín dụng = 0
        obj.response.usageAmount = 0;       // Lượng hao hụt = 0
        obj.response.price = 0;             // Giá = 0
    }
    $done({ status: 200, body: JSON.stringify(obj) });
}

$done({}); // Trả về mặc định nếu không khớp
