import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import PrintReceiptModal from '../Receipt/PrintReceiptModal.js';

class CreateReceipt extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            believerOid: '',
            believerName: '',
            total: '',
            category: '油香',
            handler: '',
            showPrint: false,
            printReceiptData: null
        };
    }

    handleShow = () => {
        const isBelieverSelected = this.props.selectedBeliever !== undefined;
        this.setState({
            show: true,
            believerOid: isBelieverSelected ? this.props.selectedBeliever.id : null,
            believerName: isBelieverSelected ? (this.props.selectedBeliever.name || '') : '',
            total: '',
            category: '油香',
            handler: ''
        });
    }

    handleClose = () => {
        this.setState({
            show: false,
            believerOid: null,
            believerName: '',
            total: '',
            category: '油香',
            handler: ''
        });
    }

    inputOnChange = (e) => {
        var key = e.target.name;
        this.setState({
            [key]: e.target.value
        });
    }

    inputValidityOnChange = (e) => {
        var key = e.target.name;
        const value = (e.target.validity.valid) ? e.target.value : this.state[key];
        this.setState({
            [key]: value
        });
    }

    submitReceipt = () => {
        if (!this.state.believerName || this.state.believerName.trim() === '') {
            alert('信徒姓名為必填欄位!');
            return;
        }

        if (!this.state.total || this.state.total.trim() === '') {
            alert('金額為必填欄位!');
            return;
        }

        if (!/^\d+$/.test(this.state.total.trim())) {
            alert('金額必須為正整數阿拉伯數字!');
            return;
        }

        const totalNum = parseInt(this.state.total.trim(), 10);
        if (totalNum <= 0) {
            alert('金額必須大於 0!');
            return;
        }

        if (!this.state.handler || this.state.handler.trim() === '') {
            alert('經手人為必填欄位!');
            return;
        }

        const trimmedBelieverName = this.state.believerName.trim();
        const trimmedHandler = this.state.handler.trim();

        let self = this;
        axios.post('http://localhost:8080/temple/receipt', {
            believerOid: this.state.believerOid,
            believerName: trimmedBelieverName,
            total: totalNum,
            category: this.state.category,
            handler: trimmedHandler
        }).then(function (response) {
            const receiptData = {
                believerOid: self.state.believerOid,
                believerName: trimmedBelieverName,
                total: totalNum,
                category: self.state.category,
                handler: trimmedHandler,
                date: new Date()
            };
            self.setState({
                show: false,
                showPrint: true,
                printReceiptData: receiptData,
                believerOid: null,
                believerName: '',
                total: '',
                handler: ''
            });
        }).catch(function (error) {
            console.log(error);
            alert('開收據失敗，請檢查後端服務！');
        });
    }

    render() {
        const isBelieverSelected = this.props.selectedBeliever !== undefined;

        return (
            <div>
                <Button className="Function_Button" bsStyle="link" bsSize="small" onClick={this.handleShow}>
                    <img src="../order.png" alt="create_receipt"/>開收據
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>開立收據</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *信徒姓名:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        componentClass="input"
                                        type="text"
                                        name="believerName"
                                        placeholder="請輸入信徒姓名..."
                                        value={this.state.believerName}
                                        onChange={this.inputOnChange}
                                        readOnly={isBelieverSelected}
                                        disabled={isBelieverSelected}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *金額:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        componentClass="input"
                                        type="text"
                                        name="total"
                                        pattern="[0-9]*"
                                        placeholder="請輸入金額 (阿拉伯數字)..."
                                        value={this.state.total}
                                        onChange={this.inputValidityOnChange}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *種類:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        componentClass="select"
                                        name="category"
                                        value={this.state.category}
                                        onChange={this.inputOnChange}
                                    >
                                        <option value="油香">油香</option>
                                        <option value="契子">契子</option>
                                        <option value="進香油香">進香油香</option>
                                        <option value="聖誕">聖誕</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *經手人:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        componentClass="input"
                                        type="text"
                                        name="handler"
                                        placeholder="請輸入經手人姓名..."
                                        value={this.state.handler}
                                        onChange={this.inputOnChange}
                                    />
                                </Col>
                            </FormGroup>

                            <Col componentClass={ControlLabel}>
                                (備註: * 為必填欄位，開立完成後可直接列印感謝狀)
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitReceipt}>確認</Button>
                        <Button onClick={this.handleClose}>取消</Button>
                    </Modal.Footer>
                </Modal>

                {/* 感謝狀列印預覽 Dialog */}
                <PrintReceiptModal
                    show={this.state.showPrint}
                    onHide={() => this.setState({ showPrint: false })}
                    receipt={this.state.printReceiptData}
                />
            </div>
        );
    }
}

export default CreateReceipt;
