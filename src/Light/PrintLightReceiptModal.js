import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { formatRocDate } from '../Receipt/receiptUtils.js';

class PrintLightReceiptModal extends React.Component {

    handlePrint = () => {
        const printableArea = document.getElementById('light-receipt-printable-area');
        if (!printableArea) return;

        let printIframe = document.getElementById('light-receipt-print-iframe');
        if (!printIframe) {
            printIframe = document.createElement('iframe');
            printIframe.id = 'light-receipt-print-iframe';
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
        iframeDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>點燈收據列印</title><style>
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
.light-receipt-container {
    width: 200mm;
    height: 144mm;
    position: relative;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background-color: #ffffff;
    font-family: "DFKai-SB", "BiauKai", "標楷體", "Kaiti TC", serif;
    page-break-inside: avoid;
    break-inside: avoid;
    page-break-after: avoid;
    break-after: avoid;
}
.light-vcol {
    writing-mode: vertical-rl;
    text-orientation: upright;
    position: absolute;
    box-sizing: border-box;
    color: #111111;
    line-height: 1;
}
.grid-table {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
}
.grid-table td {
    border: 1.5px solid #111111;
    text-align: center;
    vertical-align: middle;
    width: 12.5%;
    height: 50%;
    font-size: 19px;
    font-family: "DFKai-SB", "BiauKai", "標楷體", serif;
    padding: 2px;
}
.cell-vertical-text {
    writing-mode: vertical-rl;
    text-orientation: upright;
    display: inline-block;
    letter-spacing: 4px;
    font-weight: bold;
}
</style></head><body>${printableArea.outerHTML}</body></html>`);
        iframeDoc.close();

        setTimeout(() => {
            printIframe.contentWindow.focus();
            printIframe.contentWindow.print();
        }, 250);
    };

    render() {
        const { show, onHide, receipt } = this.props;
        if (!receipt) return null;

        const roc = formatRocDate(receipt.date || new Date());
        const isGuangming = receipt.category === '光明燈';
        const isTaisui = receipt.category === '太歲';

        // 整理名字陣列至 16 格 (8欄 x 2列)
        // 依照傳統直式書寫習慣：由右至左、由上而下
        // 第 1 列 (上排): 右至左 index 0 ~ 7
        // 第 2 列 (下排): 右至左 index 8 ~ 15
        const rawNames = receipt.names || [];
        const topRowNames = [];
        const bottomRowNames = [];
        for (let i = 0; i < 8; i++) {
            topRowNames.push(rawNames[i] || '');
        }
        for (let i = 8; i < 16; i++) {
            bottomRowNames.push(rawNames[i] || '');
        }

        return (
            <Modal show={show} onHide={onHide} bsSize="large">
                <Modal.Header closeButton className="no-print">
                    <Modal.Title>點燈收據列印預覽</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ overflow: 'auto', background: '#e9ecef', padding: '20px', textAlign: 'center' }}>
                    <div id="light-receipt-printable-area" style={{
                        width: '200mm',
                        height: '144mm',
                        margin: '0 auto',
                        position: 'relative',
                        backgroundColor: '#ffffff',
                        boxSizing: 'border-box',
                        fontFamily: '"DFKai-SB", "BiauKai", "標楷體", "Kaiti TC", serif',
                        color: '#111111',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden'
                    }}>
                        {/* 1. 最右側：收據 標題 (直書居中偏上) */}
                        <div style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            position: 'absolute',
                            right: '10mm',
                            top: '36mm',
                            fontSize: '32px',
                            fontWeight: 'bold',
                            letterSpacing: '18px'
                        }}>
                            收　據
                        </div>

                        {/* 2. 住址 (收據左側上方橫書) */}
                        <div style={{
                            position: 'absolute',
                            right: '34mm',
                            top: '12mm',
                            fontSize: '17px',
                            textAlign: 'left'
                        }}>
                            <span style={{ fontWeight: 'bold' }}>住址：</span>
                            <span>{receipt.address}</span>
                        </div>

                        {/* 3. 種類勾選方框 (住址下方) */}
                        <div style={{
                            position: 'absolute',
                            right: '48mm',
                            top: '20mm',
                            fontSize: '18px',
                            display: 'flex',
                            gap: '15px'
                        }}>
                            <span>{isGuangming ? '■' : '□'} 光明燈</span>
                            <span>{isTaisui ? '■' : '□'} 太歲</span>
                        </div>

                        {/* 4. 中央 8 欄 x 2 列名冊大表格 (左右寬約 98mm，高約 78mm) */}
                        <div style={{
                            position: 'absolute',
                            left: '56mm',
                            top: '28mm',
                            width: '98mm',
                            height: '78mm',
                            border: '1.5px solid #111111',
                            boxSizing: 'border-box'
                        }}>
                            <table style={{
                                width: '100%',
                                height: '100%',
                                borderCollapse: 'collapse',
                                tableLayout: 'fixed'
                            }}>
                                <tbody>
                                    {/* 上排 8 格 (右到左，所以 index 7 降序到 0) */}
                                    <tr style={{ height: '50%' }}>
                                        {[7, 6, 5, 4, 3, 2, 1, 0].map((idx) => (
                                            <td key={`top-${idx}`} style={{
                                                border: '1.5px solid #111111',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                padding: '2px',
                                                fontSize: '18px'
                                            }}>
                                                {topRowNames[idx] && (
                                                    <span style={{
                                                        writingMode: 'vertical-rl',
                                                        textOrientation: 'upright',
                                                        letterSpacing: '3px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {topRowNames[idx]}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                    {/* 下排 8 格 (右到左，index 15 降序到 8) */}
                                    <tr style={{ height: '50%' }}>
                                        {[15, 14, 13, 12, 11, 10, 9, 8].map((idx) => (
                                            <td key={`bottom-${idx}`} style={{
                                                border: '1.5px solid #111111',
                                                textAlign: 'center',
                                                verticalAlign: 'middle',
                                                padding: '2px',
                                                fontSize: '18px'
                                            }}>
                                                {bottomRowNames[idx - 8] && (
                                                    <span style={{
                                                        writingMode: 'vertical-rl',
                                                        textOrientation: 'upright',
                                                        letterSpacing: '3px',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {bottomRowNames[idx - 8]}
                                                    </span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 5. 表格下方：合計 元 & 電話 */}
                        <div style={{
                            position: 'absolute',
                            left: '56mm',
                            top: '112mm',
                            width: '98mm',
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontSize: '18px'
                        }}>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>合計：</span>
                                <span style={{ fontWeight: 'bold', fontSize: '20px', marginLeft: '5px', marginRight: '5px' }}>
                                    {receipt.total}
                                </span>
                                <span>元</span>
                            </div>
                            <div>
                                <span style={{ fontWeight: 'bold' }}>電話：</span>
                                <span>{receipt.phone}</span>
                            </div>
                        </div>

                        {/* 6. 表格左方直欄：此據 */}
                        <div style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            position: 'absolute',
                            left: '46mm',
                            top: '36mm',
                            fontSize: '22px',
                            fontWeight: 'bold',
                            letterSpacing: '10px'
                        }}>
                            此據
                        </div>

                        {/* 7. 表格左方直欄：新竹市朝山靈德宮管理委員會 */}
                        <div style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            position: 'absolute',
                            left: '37mm',
                            top: '40mm',
                            fontSize: '17px',
                            fontWeight: 'bold',
                            letterSpacing: '3px'
                        }}>
                            新竹市朝山靈德宮管理委員會
                        </div>

                        {/* 8. 表格左方直欄：經手人 */}
                        <div style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            position: 'absolute',
                            left: '26mm',
                            top: '78mm',
                            fontSize: '16px',
                            letterSpacing: '2px'
                        }}>
                            經手人：<span style={{ fontWeight: 'bold' }}>{receipt.handler}</span>
                        </div>

                        {/* 9. 最左側直欄：中華民國 年 月 日 */}
                        <div style={{
                            writingMode: 'vertical-rl',
                            textOrientation: 'upright',
                            position: 'absolute',
                            left: '12mm',
                            top: '14mm',
                            fontSize: '16px',
                            letterSpacing: '3px',
                            whiteSpace: 'nowrap'
                        }}>
                            中華民國　{roc.yearChinese}　年　{roc.monthChinese}　月　{roc.dayChinese}　日
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="no-print">
                    <Button bsStyle="primary" onClick={this.handlePrint}>
                        <span role="img" aria-label="print">🖨️</span> 列印收據
                    </Button>
                    <Button onClick={onHide}>關閉</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PrintLightReceiptModal;
