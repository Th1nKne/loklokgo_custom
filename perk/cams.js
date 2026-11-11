const vipData = {
  "ret": 0,
  "data": {
    "cs_vip": 1,
    "fax_balance": "99999",
    "used_points": "0",
    "points": "99999",
    "pdfword_count": "99999",
    "bookmode_balance": 99999,
    "immt_expy_points": "0",
    "ocr_balance": 99999,
    "ocr_count": 99999,
    "CamScanner_BookMode": 99999,
    "CamScanner_RoadMap": 99999,
    "CamScanner_RoadMap_Excel": 99999,
    "no_login_ocr_balance": "99999",
    "psnl_vip_property": {
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
        "days": 3650,
        "end_days": 36500,
        "level": 9
      },
      "group1_paid": 1,
      "ys_first_pay": 0,
      "renew_type": "year",
      "expiry": 4092599349,
      "grade": 2,
      "last_payment_method": "appstore",
      "product_id": "com.intsig.camscanner.premiums.oneyear.autorenewable.plus"
    }
  }
};

$notification.post("CamScanner VIP", "Đã tiêm gói VIP thành công!", $request.url);
$done({ body: JSON.stringify(vipData) });
