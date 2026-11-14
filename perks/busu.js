try {
    var bodyString = typeof $response.body === "string" 
        ? $response.body 
        : new TextDecoder("utf-8").decode($response.body);
    
    var guding = JSON.parse(bodyString);
    if (guding && guding.data) {
        guding.data.access = {"tier": "plus"};
    }
    $done({ body: JSON.stringify(guding) });
} catch(e) {
    $done({});
}
