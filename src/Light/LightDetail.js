import React from 'react';
import axios from 'axios';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { Button } from 'react-bootstrap';
import CreateLightReceipt from './CreateLightReceipt.js';
import PrintLightReceiptModal from './PrintLightReceiptModal.js';

class LightDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            receiptList: [],
            showPrint: false,
            selectedPrintReceipt: null
        };
        this.options = {
            sortIndicator: true,
            noDataText: '目前尚無點燈收據資料'
        };
    }

    componentDidMount() {
        this.fetchReceipts();
    }

    fetchReceipts = () => {
        const { lightOid } = this.props;
        const self = this;
        axios.get(`http://localhost:8080/temple/light/${lightOid}/receipt`)
            .then(function (response) {
                self.setState({ receiptList: response.data || [] });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    handlePrintRow = (row) => {
        this.setState({
            showPrint: true,
            selectedPrintReceipt: row
        });
    };

    printFormatter = (cell, row) => {
        return (
            <Button
                bsStyle="info"
                bsSize="xsmall"
                onClick={() => this.handlePrintRow(row)}
            >
                <span role="img" aria-label="print">🖨️</span> 列印
            </Button>
        );
    };

    namesFormatter = (cell, row) => {
        if (!cell || cell.length === 0) return '-';
        return cell.join('、');
    };

    render() {
        const { lightOid, year, onBack } = this.props;

        return (
            <div>
                {/* 頂部功能列 */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}>
                    <Button bsStyle="default" onClick={onBack} style={{ marginRight: '15px' }}>
                        ← 返回年份清單
                    </Button>
                    <h4 style={{ margin: 0, fontWeight: 'bold', marginRight: '20px' }}>
                        【{year} 年度】點燈收據管理
                    </h4>
                    <CreateLightReceipt
                        lightOid={lightOid}
                        year={year}
                        onReceiptCreated={this.fetchReceipts}
                    />
                </div>

                {/* 收據清單表格 */}
                <BootstrapTable
                    data={this.state.receiptList}
                    options={this.options}
                    bordered={true}
                    pagination={true}
                    striped
                    hover
                    condensed
                >
                    <TableHeaderColumn dataField="id" isKey hidden>
                        ID
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="date" width="12%" dataSort={true}>
                        日期
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="category" width="10%" dataSort={true}>
                        種類
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="names" width="22%" dataFormat={this.namesFormatter}>
                        點燈信徒名冊
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="address" width="22%">
                        地址
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="phone" width="12%">
                        電話
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="total" width="10%" dataSort={true}>
                        金額 (元)
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="handler" width="10%">
                        經手人
                    </TableHeaderColumn>
                    <TableHeaderColumn dataField="actions" width="8%" dataFormat={this.printFormatter} dataAlign="center">
                        操作
                    </TableHeaderColumn>
                </BootstrapTable>

                <PrintLightReceiptModal
                    show={this.state.showPrint}
                    onHide={() => this.setState({ showPrint: false })}
                    receipt={this.state.selectedPrintReceipt}
                />
            </div>
        );
    }
}

export default LightDetail;
