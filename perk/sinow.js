/*************************************
 SNOW Unlock Pro — Shadowrocket Module
 Author: Axiom (fix for boss man)
 Usage: Test on iPhone via Shadowrocket
**************************************/

const url = $request.url;
const body = $response.body;
const headers = $request.headers;

// Log để biết script có chạy trên máy không
console.log("[SNOW] Script triggered: " + url);

if (!body) {
  console.log("[SNOW] No body, skipping.");
  $done({});
}

let obj = {};
try {
  obj = JSON.parse(body);
} catch (e) {
  console.log("[SNOW] JSON parse failed: " + e);
  $done({});
}

const NOW = Date.now();
const EXPIRE = 4092599349000; // ~2099

// Map bundle id -> product id
const PRODUCT_MAP = {
  "com.campmobile.snow": "com.campmobile.snow.subscribe.oneyear",
  "com.snowcorp.epik": "com.snowcorp.epik.subscribe.plan.oneyear"
};

// Lấy bundle id từ User-Agent hoặc từ body
let ua = "";
for (const k of Object.keys(headers)) {
  if (k.toLowerCase() === "user-agent") {
    ua = headers[k] || "";
    break;
  }
}

let bundleId = "com.campmobile.snow"; // default cho SNOW
const uaMatch = ua.match(/iphoneapp\.(\w+)/i);
if (uaMatch) {
  const appKey = "iphoneapp." + uaMatch[1].toLowerCase();
  if (PRODUCT_MAP[appKey]) {
    bundleId = appKey.replace("iphoneapp.", "com."); // fallback nếu cần
  }
}

// Nếu body có packageName thì ưu tiên dùng
if (obj.packageName && PRODUCT_MAP[obj.packageName]) {
  bundleId = obj.packageName;
}

const productId = PRODUCT_MAP[bundleId] || PRODUCT_MAP["com.campmobile.snow"];

// Hàm dựng object subscription giả
function fakeSubscription() {
  return {
    managed: true,
    status: "ACTIVE",
    startDate: NOW,
    productId: productId,
    expireDate: EXPIRE
  };
}

// --- Xử lý endpoint /v1/purchase/subscription/subscriber/status ---
if (/\/v1\/purchase\/subscription\/subscriber\/status/i.test(url)) {
  if (!obj.result) obj.result = {};
  obj.result = {
    products: [fakeSubscription()],
    tickets: [fakeSubscription()],
    activated: true
  };
  console.log("[SNOW] Patched /subscriber/status -> activated=true");
}

// --- Xử lý endpoint /v1/user/me (endpoint mày thấy trên Charles) ---
else if (/\/v1\/user\/me/i.test(url)) {
  // Nếu có object vip/subscription thì đè
  if (obj.vip) {
    obj.vip = {
      status: "ACTIVE",
      productId: productId,
      startDate: NOW,
      expireDate: EXPIRE,
      activated: true
    };
    console.log("[SNOW] Patched /user/me -> vip.status=ACTIVE");
  } else if (obj.subscription) {
    obj.subscription = {
      status: "ACTIVE",
      productId: productId,
      startDate: NOW,
      expireDate: EXPIRE,
      activated: true
    };
    console.log("[SNOW] Patched /user/me -> subscription.status=ACTIVE");
  } else {
    // Nếu không có key nào quen, gắn cờ vip vào root
    obj.vip = {
      status: "ACTIVE",
      productId: productId,
      startDate: NOW,
      expireDate: EXPIRE,
      activated: true
    };
    console.log("[SNOW] Patched /user/me -> injected vip (fallback)");
  }
} else {
  console.log("[SNOW] URL not matched, doing nothing.");
}

$done({ body: JSON.stringify(obj) });
