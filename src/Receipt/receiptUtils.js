/**
 * 將阿拉伯數字金額轉換為傳統中文大寫金額
 * 例如：1200 -> 壹仟貳佰元正
 */
export function convertToChineseCurrency(num) {
    if (!num || isNaN(num) || num <= 0) return '零元正';

    const digits = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '萬', '億'];

    let n = Math.floor(Number(num));
    if (n === 0) return '零元正';

    let result = '';
    let bigUnitIndex = 0;

    while (n > 0) {
        let part = n % 10000;
        if (part > 0) {
            let partStr = '';
            let zero = false;
            let tempPart = part;
            for (let i = 0; i < 4; i++) {
                let digit = tempPart % 10;
                if (digit === 0) {
                    if (zero && partStr.length > 0 && !partStr.startsWith('零')) {
                        partStr = '零' + partStr;
                    }
                } else {
                    partStr = digits[digit] + units[i] + partStr;
                    zero = true;
                }
                tempPart = Math.floor(tempPart / 10);
            }
            partStr = partStr.replace(/零+$/, '');
            result = partStr + bigUnits[bigUnitIndex] + result;
        }
        n = Math.floor(n / 10000);
        bigUnitIndex++;
    }

    result = result.replace(/零+/g, '零').replace(/^零/, '').replace(/零$/, '');
    return result + '元正';
}

/**
 * 將西元日期字串轉換為民國年、月、日（包含國字與數字）
 * 例如：'2026/10/28' -> { year: 115, yearChinese: '一 一 五', monthChinese: '十', dayChinese: '二十八' }
 */
export function formatRocDate(dateStr) {
    let d = new Date();
    if (dateStr) {
        const parts = String(dateStr).split(/[-/]/);
        if (parts.length === 3) {
            const y = parseInt(parts[0], 10);
            const m = parseInt(parts[1], 10);
            const day = parseInt(parts[2], 10);
            if (!isNaN(y) && !isNaN(m) && !isNaN(day)) {
                d = new Date(y, m - 1, day);
            }
        }
    }
    const rocYear = d.getFullYear() > 1911 ? d.getFullYear() - 1911 : d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();

    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const rocYearChinese = String(rocYear).split('').map(c => digits[parseInt(c, 10)] || c).join('');

    const toChineseMonthOrDay = (n) => {
        const cDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
        if (n <= 10) return cDigits[n];
        if (n < 20) return '十' + (n % 10 === 0 ? '' : cDigits[n % 10]);
        if (n < 30) return '二十' + (n % 10 === 0 ? '' : cDigits[n % 10]);
        return '三十' + (n % 10 === 0 ? '' : cDigits[n % 10]);
    };

    return {
        year: rocYear,
        yearChinese: rocYearChinese,
        month: month,
        monthChinese: toChineseMonthOrDay(month),
        day: day,
        dayChinese: toChineseMonthOrDay(day)
    };
}
