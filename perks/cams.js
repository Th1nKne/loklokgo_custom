// Shadowrocket — CamScanner VIP unlocker v2
// Endpoints: /purchase/cs/query_property | /queryProperty | /getPrivilegeItem
// Fixes: empty-body passthrough, doubled-JSON recovery, ret=0 forced,
//        server_time + points_exchange_cfgrs preserved, hasOwn guard on dir/greetcard

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

const BALANCE_OVERRIDE = {
    "removead": "1",
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

const DIR_OVERRIDE = {
    vip_total_num: 999999, normal_vip_total_num: 999999,
    vip_layer_num: 99, normal_vip_layer_num: 99,
    advanced_folder_num: 999999, advanced_folder_layer: 99,
    user_total_num: 999999, license_total_num: 999999,
    license_layer_num: 99, single_layer_num: 99,
    user_layer_num: 99, total_num: 999999,
    edu_total_num: 999999, corp_vip_layer_num: 99,
    new_layer_num: 99, edu_layer_num: 99
};

const PRIVILEGE_TREE = {
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

// ---- safe parse: empty → null, doubled JSON → first object ----
function parseSafe(raw) {
    if (typeof raw !== "string") return null;
    const s = raw.trim();
    if (s.length === 0) return null;
    try { return JSON.parse(s); } catch (_) {}
    try {
        let depth = 0, end = -1;
        for (let i = 0; i < s.length; i++) {
            const c = s[i];
            if (c === '{') depth++;
            else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
        }
        if (end > 0) return JSON.parse(s.slice(0, end + 1));
    } catch (_) {}
    return null;
}

const URL = $request.url || "";
const body = parseSafe($response.body);

if (!body) {
    // empty / double-fail → DO NOT touch original response, just pass through
    console.log("[CamScanner] passthrough (unparsable/empty): " + URL.slice(0, 120));
    $done({});
} else {
    // Force app-visible success
    body.ret = "0";
    if (!body.data || typeof body.data !== "object") body.data = {};

    // Preserve server_time (app uses it for expiry math)
    if (body.data.server_time === undefined && body.server_time !== undefined) {
        body.data.server_time = body.server_time;
    }

    // === /purchase/cs/query_property ===
    if (URL.indexOf("/purchase/cs/query_property") !== -1) {
        Object.assign(body.data, BALANCE_OVERRIDE);
        body.data.psnl_vip_property = VIP_OBJ;

        if (!body.data.dir || typeof body.data.dir !== "object") body.data.dir = {};
        Object.assign(body.data.dir, DIR_OVERRIDE);

        if (body.data.greetcard_list && typeof body.data.greetcard_list === "object") {
            for (const k in body.data.greetcard_list) body.data.greetcard_list[k] = "999999";
        }

        // Only inject default exchange rates if server didn't send them
        if (!body.data.points_exchange_cfgrs) {
            body.data.points_exchange_cfgrs = {
                "CamScanner_CloudOCR": 50, "CamScanner_CertMode": 200,
                "CamScanner_CloudCap_1G": 1000, "CamScanner_Translation": 50,
                "CamScanner_Profile_Card_Format": 1000, "CamScanner_Sign": 500,
                "CamScanner_Excel": 500, "CamScanner_Watermarks": 50,
                "CamScanner_Pdfword": 500, "CamScanner_Pdf2excel": 500,
                "CamScanner_Pdf2ppt": 500, "CamScanner_AlbumImport": 300,
                "CamScanner_ID_Card_Credit": 500, "CamScanner_ID_Card_Authenticity": 500
            };
        }
    }
    // === /queryProperty ===
    else if (URL.indexOf("/queryProperty") !== -1) {
        if (!body.data.ar_property || typeof body.data.ar_property !== "object") body.data.ar_property = {};
        body.data.ar_property.psnl_vip_property = VIP_OBJ;
        body.data.psnl_vip_property = VIP_OBJ;

        if (!body.ar_property || typeof body.ar_property !== "object") body.ar_property = {};
        body.ar_property.psnl_vip_property = VIP_OBJ;
    }
    // === /getPrivilegeItem ===
    else if (URL.indexOf("/getPrivilegeItem") !== -1) {
        body.data.data = PRIVILEGE_TREE;
    }

    $done({ body: JSON.stringify(body) });
}
