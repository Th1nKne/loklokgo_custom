// Shadowrocket — http-response script
// Handle /purchase/cs/query_property + /queryProperty + /getPrivilegeItem

const VIP_OBJ = {
    "group1_paid": 1, "ms_first_pay": 0, "vip_type": "svip",
    "auto_renewal": true, "in_trial": 1, "members_page": 0,
    "pc_vip": 1, "renew_type": "year", "renew_method": "appstore",
    "ys_first_pay": 0, "initial_tm": "32662137600",
    "product_id": "com.intsig.camscanner.premiums.oneyear.autorenewable.free.test1",
    "vip_level_info": {"score":0,"level":0,"next_score":1,"start_score":0,"create_time":0},
    "nxt_renew_tm": "32662137600", "last_payment_method": "appstore",
    "grade": 2, "svip": 1, "expiry": 32662137600, "pending": 0,
    "level_info": {"level":1,"end_days":30,"days":1},
    "inherited_flag": 0, "group2_paid": 0
};

// Type phải khớp gốc: string vs number
const BALANCE_OVERRIDE = {
    "removead": "1",                       // 🔑 VIP FLAG — string
    "points": "999999",
    "used_points": "0",
    "immt_expy_points": "999999",
    "fax_balance": "999999",
    "pdfword_balance": "999999",
    "add_watermarks_balance": "999999",
    "cert_mode_balance": "999999",
    "upload_pdf_balance": "999999",
    "profile_card_balance": "999999",
    "excel_balance": "999999",
    "ai_imagefilter_balance": "999999",
    "watchad_vip_chance": "999",
    "watchad_vip_chance_total": "999",
    "bookmode_balance": 999999,
    "ocr_balance": 999999,
    "login_ocr_balance": 999999,
    "no_login_ocr_balance": 999999,
    "watermarks_balance": 999999,
    "trans_balance": 999999,
    "patting_balance": 999999,
    "imagerestore_balance": 999999,
    "vip_imagerestore_balance": 999999,
    "vip_balance_recolor": 999999,
    "balance_recolor": 999999,
    "balance_demoire": 999999,
    "CamScanner_Intellect_Erase": 999999,
    "CamScanner_Erase": 999999,
    "CamScanner_Toolbox_Watermark": 999999,
    "CamScanner_Bills_Verify": 999999,
    "CamScanner_AI_Doc_Image_Multi_Edit": 999999,
    "CamScanner_RoadMap": 999999,
    "CamScanner_RoadMap_Excel": 999999,
    "CamScanner_BookMode": 999999,
    "CamScanner_ImageRestore": 999999,
    "CamScanner_DirNum": 999999,
    "CamScanner_CertMode": 999999,
    "CamScanner_Pdfword": 999999,
    "CamScanner_CloudOCR": 999999,
    "CamScanner_Translation": 999999
};

const URL = $request.url;
let body;
try { body = JSON.parse($response.body); }
catch (e) {
    // response doubled (bug Frida cũ) hoặc lỗi format
    console.log("CamScanner mod JSON.parse fail: " + e + " | raw len=" + $response.body.length);
    $done({});
}

// ---- Endpoint: query_property ----
if (URL.indexOf('/purchase/cs/query_property') !== -1) {
    if (!body.data) body.data = {};
    Object.assign(body.data, BALANCE_OVERRIDE);
    body.data.psnl_vip_property = VIP_OBJ;
    // dir — đảm bảo VIP tier
    if (!body.data.dir) body.data.dir = {};
    Object.assign(body.data.dir, {
        vip_total_num: 999999, normal_vip_total_num: 999999,
        vip_layer_num: 99, normal_vip_layer_num: 99,
        advanced_folder_num: 999999, advanced_folder_layer: 99,
        user_total_num: 999999, license_total_num: 999999,
        total_num: 999999, edu_total_num: 999999,
        corp_vip_layer_num: 99, new_layer_num: 99, edu_layer_num: 99
    });
    // greetcard — mở full
    if (body.data.greetcard_list) {
        for (let k in body.data.greetcard_list) body.data.greetcard_list[k] = "999999";
    }
}

// ---- Endpoint: queryProperty (VIP status thật) ----
else if (URL.indexOf('/queryProperty') !== -1) {
    if (!body.data) body.data = {};
    if (!body.data.ar_property) body.data.ar_property = {};
    body.data.ar_property.psnl_vip_property = VIP_OBJ;
    body.data.psnl_vip_property = VIP_OBJ;
    // một số app nhét VIP vào top-level
    if (!body.ar_property) body.ar_property = {};
    body.ar_property.psnl_vip_property = VIP_OBJ;
}

// ---- Endpoint: getPrivilegeItem ----
else if (URL.indexOf('/getPrivilegeItem') !== -1) {
    if (!body.data) body.data = {};
    body.data.data = {
        "document": [
            {"balance": -1, "item": "CamScanner_Pic2pdf"},
            {"balance": -1, "item": "CamScanner_PdfCompress"},
            {"balance": -1, "item": "CamScanner_PdfEncrypt"},
            {"balance": -1, "item": "CamScanner_FileMerge"},
            {"balance": -1, "item": "CamScanner_PdfExtract"},
            {"balance": -1, "item": "CamScanner_PdfWatermark"},
            {"balance": -1, "item": "CamScanner_PdfSign"},
            {"balance": 999999, "item": "CamScanner_Intellect_Erase"}
        ],
        "transfer": [
            {"balance": -1, "item": "CamScanner_ExcelRecoginze"},
            {"balance": -1, "item": "CamScanner_RoadMap"},
            {"balance": -1, "item": "CamScanner_Pdf2ppt"},
            {"balance": 999999, "item": "CamScanner_CloudOCR"}
        ],
        "other": [
            {"balance": 999999, "item": "CamScanner_Translation"},
            {"balance": -1, "item": "CamScanner_DirNum"},
            {"balance": -1, "item": "CamScanner_IP_REMOVEAD"},
            {"balance": -1, "item": "CamScanner_PingTu"},
            {"balance": 999999, "item": "CamScanner_Points"},
            {"balance": 999999, "item": "CamScanner_Fax_Balance"}
        ],
        "scaner": [
            {"balance": 999999, "item": "CamScanner_ImageRestore"},
            {"balance": -1, "item": "CamScanner_Patting"},
            {"balance": 999999, "item": "CamScanner_Profile_Card_Format"},
            {"balance": -1, "item": "CamScanner_BookMode"},
            {"balance": -1, "item": "CamScanner_CertMode"},
            {"balance": -1, "item": "CamScanner_HDScan"},
            {"balance": 999999, "item": "CamScanner_CloudOCR"}
        ],
        "pure": [
            {"balance": -1, "item": "CamScanner_IP_REMOVEAD"}
        ]
    };
}

$done({ body: JSON.stringify(body) });
