/**
 * 格式化日期
 * @param {string|Date} date - ISO字符串或Date对象
 * @param {string} format - 格式模板（默认 'YYYY-MM-DD HH:mm:ss'）
 * @returns {string} 格式化后的时间字符串
 */
function formatDate (date, format = 'YYYY-MM-DD HH:mm:ss') {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d)) return '';

    const pad = (n) => String(n).padStart(2, '0');
    const map = {
        YYYY: d.getFullYear(),
        MM: pad(d.getMonth() + 1),
        DD: pad(d.getDate()),
        HH: pad(d.getHours()),
        mm: pad(d.getMinutes()),
        ss: pad(d.getSeconds())
    };

    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key]);
}
module.exports = {
    formatDate
}