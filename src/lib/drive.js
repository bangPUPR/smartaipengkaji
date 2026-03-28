/**
 * =========================================================
 * GOOGLE DRIVE API CONNECTOR 
 * Menghubungkan Frontend ke Google Apps Script (Drive)
 * =========================================================
 */
import { APP_CONFIG } from './config.js';

const GAS_URL = import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL;

/**
 * Mengunggah array of base64 objek ke Google Drive melalui Webhook GAS
 * @param {Array<{base64: string, mimeType: string, name: string}>} filesData 
 * @param {string} proyekId
 * @returns {Promise<Array<string>>} Array of URL gambar dari Google Drive
 */
export async function uploadToGoogleDrive(filesData, proyekId) {
  if (!GAS_URL) {
    console.warn("VITE_GOOGLE_APPS_SCRIPT_URL belum disetel di .env. Menggagalkan unggahan Drive.");
    return []; // Bypass jika API tidak disetel
  }

  const urls = [];

  // Lakukan unggahan satu-per-satu atau pararel ke GAS
  for (const file of filesData) {
    try {
      // 1. Siapkan Request
      const payload = {
        base64: file.base64,
        mimeType: file.mimeType,
        fileName: file.name || `Lampiran_${new Date().getTime()}`,
        proyekId: proyekId
      };

      // 2. Tembak ke GAS Webhook
      const response = await fetch(GAS_URL, {
        method: 'POST',
        // mode: 'cors'
        // CATATAN PENTING: Jika GAS me-reject via CORS saat development localhost, 
        // kita menggunakan 'no-cors' atau mengaktifkan redirect `follow`
        headers: {
          'Content-Type': 'text/plain;charset=utf-8' // GAS accepts raw JSON text better
        },
        body: JSON.stringify(payload)
      });

      // GAS menggunakan redirect 302, kadang fetch JS tidak bisa mendapatkan JSON respon dari cors
      // Namun Google akan tetap mengunggahnya.
      if (response.ok) {
        const data = await response.json();
        if (data && data.url) {
          urls.push(data.url);
        }
      }
    } catch (e) {
      console.error("Gagal mengunggah ke Drive via GAS:", e);
    }
  }

  return urls;
}
