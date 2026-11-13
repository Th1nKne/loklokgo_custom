let body = $response.body;

if (body) {
    let obj = JSON.parse(body);
    
    if (obj.data) {
        obj.data.tier = 1;
        obj.data.premium = 1;
        obj.data.expireTier = 4092599349000;
    }
    
    $done({ body: JSON.stringify(obj) });
} else {
    $done({});
}
