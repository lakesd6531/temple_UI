import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { convertToChineseCurrency, formatRocDate } from './receiptUtils.js';
import './PrintReceiptModal.css';

// 仿附圖傳統回紋雙線角花
const CornerFret = ({ style }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" style={{ position: 'absolute', ...style }}>
        <path
            d="M 2 2 L 38 2 L 38 12 L 12 12 L 12 28 L 28 28 L 28 18 L 18 18 L 18 22"
            fill="none"
            stroke="#111"
            strokeWidth="1.8"
        />
        <path
            d="M 6 6 L 34 6 L 34 8 L 8 8 L 8 24 L 24 24 L 24 20"
            fill="none"
            stroke="#111"
            strokeWidth="1"
        />
    </svg>
);

class PrintReceiptModal extends React.Component {

    handlePrint = () => {
        const printableArea = document.getElementById('receipt-printable-area');
        if (!printableArea) return;

        // 建立或取得隱藏的列印專用 iframe，避免 Bootstrap Modal 的 overflow 與 fixed 樣式干擾列印引擎
        let printIframe = document.getElementById('receipt-print-iframe');
        if (!printIframe) {
            printIframe = document.createElement('iframe');
            printIframe.id = 'receipt-print-iframe';
            printIframe.style.position = 'fixed';
            printIframe.style.right = '0';
            printIframe.style.bottom = '0';
            printIframe.style.width = '0';
            printIframe.style.height = '0';
            printIframe.style.border = 'none';
            document.body.appendChild(printIframe);
        }

        const iframeDoc = printIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>感謝狀列印</title><style>
@page {
    size: A5 landscape;
    margin: 0;
}
* {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
}
html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden !important;
    background: #ffffff;
    font-family: "DFKai-SB", "BiauKai", "標楷體", "Kaiti TC", serif;
}
.receipt-certificate-container {
    width: 200mm;
    height: 144mm;
    position: relative;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background-color: #ffffff;
    page-break-inside: avoid;
    break-inside: avoid;
    page-break-after: avoid;
    break-after: avoid;
}
.receipt-vcol {
    writing-mode: vertical-rl;
    text-orientation: upright;
    position: absolute;
    box-sizing: border-box;
    color: #111111;
    line-height: 1;
}
</style></head><body>${printableArea.outerHTML}</body></html>`);
        iframeDoc.close();

        // 等候 iframe DOM 與樣式就緒後呼叫列印
        setTimeout(() => {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
        }, 250);
    }

    render() {
        const { show, onHide, receipt } = this.props;
        if (!receipt) return null;

        const chineseAmount = convertToChineseCurrency(receipt.total);
        const roc = formatRocDate(receipt.date);

        return (
            <Modal show={show} onHide={onHide} bsSize="large" dialogClassName="receipt-modal-dialog">
                <Modal.Header closeButton className="no-print">
                    <Modal.Title>感謝狀列印預覽 (約 15cm × 20cm)</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: 'auto', background: '#e9ecef', padding: '25px', textAlign: 'center' }}>
                    <div id="receipt-printable-area" className="receipt-certificate-container">
                        {/* 外層框線 (距邊界 7mm) */}
                        <div style={{
                            position: 'absolute',
                            top: '7mm',
                            bottom: '7mm',
                            left: '7mm',
                            right: '7mm',
                            border: '2px solid #111',
                            boxSizing: 'border-box',
                            pointerEvents: 'none'
                        }} />

                        {/* 內層框線 (距外框 2.5mm) */}
                        <div style={{
                            position: 'absolute',
                            top: '9.5mm',
                            bottom: '9.5mm',
                            left: '9.5mm',
                            right: '9.5mm',
                            border: '1px solid #111',
                            boxSizing: 'border-box',
                            pointerEvents: 'none'
                        }} />

                        {/* 四角傳統回紋角花 */}
                        <CornerFret style={{ top: '7mm', left: '7mm' }} />
                        <CornerFret style={{ top: '7mm', right: '7mm', transform: 'scaleX(-1)' }} />
                        <CornerFret style={{ bottom: '7mm', left: '7mm', transform: 'scaleY(-1)' }} />
                        <CornerFret style={{ bottom: '7mm', right: '7mm', transform: 'scale(-1, -1)' }} />

                        {/* 第一欄：感謝狀 (右側垂直置中，大字粗體) */}
                        <div className="receipt-vcol" style={{
                            right: '25mm',
                            top: '36mm',
                            fontSize: '38px',
                            fontWeight: 'bold',
                            letterSpacing: '24px'
                        }}>
                            感　謝　狀
                        </div>

                        {/* 第二欄：茲由 姓名 善信大德，(同一直欄) */}
                        <div className="receipt-vcol" style={{
                            right: '46mm',
                            top: '18mm',
                            fontSize: '22px',
                            letterSpacing: '4px'
                        }}>
                            茲由　<span style={{ fontWeight: 'bold', fontSize: '24px' }}>{receipt.believerName}</span>　善信大德，
                        </div>

                        {/* 第三欄：虔誠樂捐本宮香油錢 */}
                        <div className="receipt-vcol" style={{
                            right: '65mm',
                            top: '18mm',
                            fontSize: '22px',
                            letterSpacing: '5px'
                        }}>
                            虔誠樂捐本宮香油錢
                        </div>

                        {/* 第四欄：新台幣 金額大寫 */}
                        <div className="receipt-vcol" style={{
                            right: '84mm',
                            top: '18mm',
                            fontSize: '22px',
                            letterSpacing: '4px'
                        }}>
                            新台幣　<span style={{ fontWeight: 'bold', fontSize: '23px' }}>{chineseAmount}</span>。
                        </div>

                        {/* 第五欄：特具此狀感謝 */}
                        <div className="receipt-vcol" style={{
                            right: '103mm',
                            top: '18mm',
                            fontSize: '22px',
                            letterSpacing: '6px'
                        }}>
                            特具此狀感謝
                        </div>

                        {/* 第六欄：此　狀 (位於中上方) */}
                        <div className="receipt-vcol" style={{
                            right: '122mm',
                            top: '26mm',
                            fontSize: '28px',
                            fontWeight: 'bold',
                            letterSpacing: '16px'
                        }}>
                            此　狀
                        </div>

                        {/* 第七欄：新竹市朝山靈德宮管理委員會 (位於此狀左下方) */}
                        <div className="receipt-vcol" style={{
                            right: '138mm',
                            top: '50mm',
                            fontSize: '17px',
                            fontWeight: 'bold',
                            letterSpacing: '2px'
                        }}>
                            新竹市朝山靈德宮管理委員會
                        </div>

                        {/* 第八欄：經手人 (位於左下角) */}
                        <div className="receipt-vcol" style={{
                            right: '150mm',
                            bottom: '20mm',
                            fontSize: '15px',
                            letterSpacing: '1px'
                        }}>
                            經手人：<span style={{ fontWeight: 'bold' }}>{receipt.handler}</span>
                        </div>

                        {/* 第九欄：中華民國 年 月 日 (最左側欄，單行直排不折行) */}
                        <div className="receipt-vcol" style={{
                            left: '18mm',
                            top: '18mm',
                            fontSize: '16px',
                            letterSpacing: '2px',
                            whiteSpace: 'nowrap'
                        }}>
                            中華民國　{roc.yearChinese}　年　{roc.monthChinese}　月　{roc.dayChinese}　日
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="no-print">
                    <Button bsStyle="primary" onClick={this.handlePrint}>
                        <span role="img" aria-label="print">🖨️</span> 列印感謝狀
                    </Button>
                    <Button onClick={onHide}>關閉</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PrintReceiptModal;
