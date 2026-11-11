let body = $response.body;

if (!body) {
  $done({});
} else {
  try {
    let obj = JSON.parse(body);
    if (!obj.data) obj.data = {};

    obj.data.psnl_vip_property = {
      "renew_method": "appstore",
      "initial_tm": "1672502400",
      "svip": 1,
      "auto_renewal": true,
      "ms_first_pay": 0,
      "pending": 0,
      "group2_paid": 0,
      "inherited_flag": 0,
      "nxt_renew_tm": "4092599349",
      "level_info": {
        "days": 1,
        "end_days": 30,
        "level": 9
      },
      "group1_paid": 1,
      "ys_first_pay": 0,
      "renew_type": "year",
      "expiry": 4092599349,
      "grade": 2,
      "last_payment_method": "appstore",
      "product_id": "com.intsig.camscanner.premiums.oneyear.autorenewable.plus"
    };

    obj.data.fax_balance = "99999";
    obj.data.used_points = "0";
    obj.data.points = "99999";
    obj.data.pdfword_count = "99999";
    obj.data.bookmode_balance = 99999;
    obj.data.immt_expy_points = "0";
    obj.data.ocr_balance = 99999;
    obj.data.no_login_ocr_balance = "99999";
    obj.data.CamScanner_RoadMap = 99999;

    console.log("CamScanner VIP Unlocked Successfully!");
    $done({ body: JSON.stringify(obj) });
  } catch (e) {
    console.log("CamScanner Parse Error: " + e.message);
    $done({});
  }
}
