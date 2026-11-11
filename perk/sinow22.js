var obj = JSON.parse($response.body);
const ua = $request.headers["User-Agent"] || $request.headers["user-agent"];
const times = Date.now();

// Rút gọn keyword để check UA dễ ăn hơn
const list = {
  "epik": "com.snowcorp.epik.subscribe.plan.oneyear",
  "snow": "com.campmobile.snow.subscribe.oneyear"
};

for (const key in list) {
    if (new RegExp(key, "i").test(ua)) {
        
        // Đảm bảo object result tồn tại
        if (!obj.result) obj.result = {};

        // Chỉ modify các value cần thiết, giữ nguyên deviceId, tt...
        obj.result.activated = true;
        obj.result.products = [
            {
                "managed": true,
                "status": "ACTIVE",
                "startDate": times,
                "productId": list[key],
                "expireDate": 32662137600000
            }
        ];
        obj.result.tickets = [
            {
                "managed": true,
                "status": "ACTIVE",
                "startDate": times,
                "productId": list[key],
                "expireDate": 32662137600000
            }
        ];
        
        console.log(`[+] Unlock ${key.toUpperCase()} Pro thành công 🎉`);
        break;
    }
}

$done({ body: JSON.stringify(obj) });
