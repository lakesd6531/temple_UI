import React from 'react';
import axios from 'axios';
import ViewReceipt from './ViewReceipt.js';

class Receipt extends React.Component {
    constructor() {
        super();
        this.state = {
            receiptData: []
        };

        this.getAllReceipt();
    }

    getAllReceipt = () => {
        let self = this;
        axios.get('http://localhost:8080/temple/receipt')
            .then(function (response) {
                let receiptList = response.data || [];
                // 依日期由最近排到舊的 (若日期相同則依單號降冪排序)
                receiptList.sort((a, b) => {
                    if (a.date !== b.date) {
                        return (b.date || '').localeCompare(a.date || '');
                    }
                    return (b.id || 0) - (a.id || 0);
                });
                self.setState({ receiptData: receiptList });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
            <div style={{ marginTop: '10px' }}>
                <ViewReceipt receiptData={this.state.receiptData} />
            </div>
        );
    }
}

export default Receipt;
