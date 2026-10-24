import React from "react";

// Import React Table
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import 'react-bootstrap-table/dist/react-bootstrap-table.min.css';

class ViewBeliever extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
        sortIndicator: true,
        noDataText: 'No data'
    };
    this.selectRow = {
        mode: 'radio',
        bgColor: 'skyblue',
        clickToSelect: true,
        hideSelectColumn: true,
        onSelect: props.handleRowSelect
    };
  }

  render() {

    return (
        <BootstrapTable data={this.props.believerData} selectRow={this.selectRow} options={this.options} bordered={true} pagination={ true } striped hover condensed>
        <TableHeaderColumn 
            dataField="id"
            isKey
            hidden
        >
            Id
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="name"
            width="10%"
            dataSort={false}
            columnTitle
            filter={ { type: 'TextFilter'} }
        >
            姓名
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="phone"
            width="11%"
            dataSort={false}
            columnTitle
            filter={ { type: 'TextFilter'} }
        >
            聯絡電話
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="cellPhone"
            width="11%"
            dataSort={false}
            columnTitle
            filter={ { type: 'TextFilter'} }
        >
            行動電話
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="address"
            width="44%"
            dataSort={false}
            columnTitle
            filter={ { type: 'TextFilter'} }
        >
            地址
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="birthday"
            width="12%"
            dataSort={false}
            columnTitle
        >
            國曆生日
        </TableHeaderColumn>

        <TableHeaderColumn 
            dataField="idNumber"
            width="12%"
            dataSort={false}
            columnTitle
            filter={ { type: 'TextFilter'} }
        >
            身分證字號
        </TableHeaderColumn>
        
    </BootstrapTable>
    );
  }
}

export default ViewBeliever;
