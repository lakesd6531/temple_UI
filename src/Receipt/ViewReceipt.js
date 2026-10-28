import React from 'react';
import { Button } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import PrintReceiptModal from './PrintReceiptModal.js';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

class ViewReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showPrint: false,
            selectedReceipt: null
        };
        this.options = {
            sortIndicator: true,
            noDataText: '暫無收據資料',
            defaultSortName: 'date',
            defaultSortOrder: 'desc'
        };
    }

    priceFormatter = (cell) => {
        if (cell === null || cell === undefined) return '';
        return cell.toLocaleString();
    }

    actionFormatter = (cell, row) => {
        return (
            <Button
                bsSize="xs"
                bsStyle="info"
                style={{ padding: '2px 8px', fontSize: '12px' }}
                onClick={() => this.setState({ showPrint: true, selectedReceipt: row })}
            >
                <span role="img" aria-label="print">🖨️</span> 列印
            </Button>
        );
    }

    render() {
        return (
            <div>
                <BootstrapTable
                    data={this.props.receiptData}
                    options={this.options}
                    bordered={true}
                    pagination={true}
                    striped
                    hover
                    condensed
                >
                    <TableHeaderColumn dataField="id" isKey hidden>Id</TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="date"
                        width="16%"
                        dataSort={true}
                        columnTitle
                        filter={{ type: 'TextFilter' }}
                    >
                        日期
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="believerName"
                        width="20%"
                        dataSort={false}
                        columnTitle
                        filter={{ type: 'TextFilter' }}
                    >
                        信徒姓名
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="category"
                        width="18%"
                        dataSort={false}
                        columnTitle
                        filter={{ type: 'TextFilter' }}
                    >
                        項目 / 種類
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="total"
                        width="16%"
                        dataSort={true}
                        dataFormat={this.priceFormatter}
                        columnTitle
                    >
                        金額
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="handler"
                        width="18%"
                        dataSort={false}
                        columnTitle
                        filter={{ type: 'TextFilter' }}
                    >
                        經手人
                    </TableHeaderColumn>

                    <TableHeaderColumn
                        dataField="action"
                        width="12%"
                        dataFormat={this.actionFormatter}
                        dataAlign="center"
                    >
                        操作
                    </TableHeaderColumn>
                </BootstrapTable>

                <PrintReceiptModal
                    show={this.state.showPrint}
                    onHide={() => this.setState({ showPrint: false })}
                    receipt={this.state.selectedReceipt}
                />
            </div>
        );
    }
}

export default ViewReceipt;
