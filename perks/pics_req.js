/**
 * Picsart Storage Spoof
 * Type: http-request
 * Target: api.picsart.com (cloud-storage)
 */

const body = {
  status: "success",
  response: {
    totalStorageSizeInBytes: 0,
    storageLimitSizeInBytes: 107374182400,
    foldersCountLimit: -1,
    totalFoldersCount: 0,
    totalFilesCount: 0
  }
};

$done({
  response: {
    status: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  }
});
