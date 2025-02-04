const axios = require("axios")
const FormData = require("form-data")
const fs = require("fs");

const utils = {
  upload: async(path) => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(path));
    try {
      const res = await axios.post('https://binhub-tau.vercel.app/upload', formData, {
        headers: { ...formData.getHeaders() },
      });
      return res.data
    } catch(e) {
      return e.message || e
    }
  },
  randomStr: (length) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  },
  randomNum: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  runtime: (seconds) => {
    const units = [
      { label: "Tahun", value: 3600 * 24 * 365 },
      { label: "Bulan", value: 3600 * 24 * 30 },
      { label: "Hari", value: 3600 * 24 },
      { label: "Jam", value: 3600 },
      { label: "Menit", value: 60 },
      { label: "Detik", value: 1 }
    ];

    let result = [];
    for (const unit of units) {
      const amount = Math.floor(seconds / unit.value);
        if (amount > 0) {
          result.push(`${amount} ${unit.label}`);
          seconds %= unit.value;
        }
    }
    return result.join(", ");
  },
  ssweb: async(url) => {
    const res = await axios.get(`https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true`)
    const data = res.data
    return {
      url: data.data.screenshot.url,
      size: data.data.screenshot.size_pretty,
      screenReso: `${data.data.screenshot.width}x${data.data.screenshot.height}`
    }
  },
  uuid: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
  },
}

module.exports = utils