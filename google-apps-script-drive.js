/**
 * ==============================================================
 * GOOGLE APPS SCRIPT - SMART AI PENGKAJI SLF (DRIVE UPLOADER)
 * ==============================================================
 * CARA DEPLOY:
 * 1. Buka script.google.com
 * 2. Buat Project Baru, hapus semua kode bawaan, lalu paste kode ini.
 * 3. Klik "Deploy" -> "New Deployment"
 * 4. Pilih type: "Web App"
 * 5. Execute as: "Me", Who has access: "Anyone"
 * 6. Copy URL Web App yang dihasilkan ke dalam file .env (VITE_GOOGLE_APPS_SCRIPT_URL)
 */

function buildCorsHeader() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders(buildCorsHeader());
}

function doPost(e) {
  try {
    // Parsing payload JSON dari Frontend Vite
    var data = JSON.parse(e.postData.contents);
    var base64Data = data.base64;
    var mimeType = data.mimeType;
    var fileName = data.fileName || 'Upload_SLF_' + new Date().getTime();
    var proyekId = data.proyekId || 'UNASSIGNED_PROYEK';
    
    // Konversi base64 kembali menjadi Blob
    var decoded = Utilities.base64Decode(base64Data);
    var blob = Utilities.newBlob(decoded, mimeType, fileName);
    
    // 1. Cari atau Buat Folder ROOT "SLF"
    var rootFolders = DriveApp.getFoldersByName("SLF");
    var rootFolder;
    if (rootFolders.hasNext()) {
      rootFolder = rootFolders.next();
    } else {
      rootFolder = DriveApp.createFolder("SLF");
    }
    
    // 2. Cari atau Buat Folder ID Proyek
    var projectFolders = rootFolder.getFoldersByName(proyekId);
    var projectFolder;
    if (projectFolders.hasNext()) {
      projectFolder = projectFolders.next();
    } else {
      projectFolder = rootFolder.createFolder(proyekId);
    }
    
    // 3. Simpan File ke dalam folder Proyek tersebut
    var file = projectFolder.createFile(blob);
    
    // Atur perizinan agar file bisa dilihat secara publik via link oleh Web App
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 4. Ambil URL Publik
    var url = file.getUrl();
    var downloadUrl = file.getDownloadUrl();
    
    // Kembalikan Response JSON dengan Header CORS
    var result = {
      status: 'success',
      url: url,
      downloadUrl: downloadUrl,
      fileId: file.getId()
    };
    
    var output = ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
    // Apps Script tidak langsung mendukung setHeaders(). 
    // Untuk mengakalinya, kita mengirimkannya via format biasa atau menggunakan `TEXT` MimeType jika JSON gagal.
    return output;
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handler GET request untuk testing akses Endpoint
function doGet(e) {
  return ContentService.createTextOutput("Smart AI Pengkaji SLF - Drive API is Running Active!");
}
