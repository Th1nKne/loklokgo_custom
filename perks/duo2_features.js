var features = [
  "NO_NETWORK_ADS",
  "UNLIMITED_HEARTS",
  "LEGENDARY_LEVEL",
  "MISTAKES_INBOX",
  "MASTERY_QUIZ",
  "NO_SUPER_PROMOS",
  "LICENSED_SONGS",
  "CHAT_TUTORS",
  "EXPLAIN_MY_ANSWER",
  "VIDEO_CALL_IN_PATH",
  "VIDEO_CALL_IN_PRACTICE_HUB",
  "CAN_ADD_SECONDARY_MEMBERS"
];

let obj = {
  "subscriptionFeatures": features,
  "advertisableFeatures": features,
  "purchasableFeatures": [
    "CAN_PURCHASE_IAP",
    "CAN_PURCHASE_SUBSCRIPTION",
    "CAN_PURCHASE_APPLE_GIFT_SUBSCRIPTION",
    "CAN_PURCHASE_LITE"
  ]
};

$done({ body: JSON.stringify(obj), status: 200 });
