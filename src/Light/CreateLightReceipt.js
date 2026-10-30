import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col, ControlLabel, HelpBlock } from 'react-bootstrap';
import PrintLightReceiptModal from './PrintLightReceiptModal.js';

class CreateLightReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            address: '',
            category: '光明燈',
            phone: '',
            total: '',
            handler: '',
            names: [''],
            showPrint: false,
            printReceiptData: null
        };
    }

    handleShow = () => {
        this.setState({
            show: true,
            address: '',
            category: '光明燈',
            phone: '',
            total: '',
            handler: '',
            names: ['']
        });
    };

    handleClose = () => {
        this.setState({
            show: false,
            address: '',
            category: '光明燈',
            phone: '',
            total: '',
            handler: '',
            names: ['']
        });
    };

    inputOnChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    inputValidityOnChange = (e) => {
        const key = e.target.name;
        const value = e.target.validity.valid ? e.target.value : this.state[key];
        this.setState({
            [key]: value
        });
    };

    handleNameChange = (index, value) => {
        const newNames = [...this.state.names];
        newNames[index] = value;
        this.setState({ names: newNames });
    };

    addNameField = () => {
        if (this.state.names.length >= 16) {
            alert('名冊上限為 16 位！');
            return;
        }
        this.setState({
            names: [...this.state.names, '']
        });
    };

    removeNameField = (index) => {
        if (this.state.names.length <= 1) {
            alert('至少需保留一位姓名欄位！');
            return;
        }
        const newNames = this.state.names.filter((_, i) => i !== index);
        this.setState({ names: newNames });
    };

    submitReceipt = () => {
        if (!this.state.address || this.state.address.trim() === '') {
            alert('地址為必填欄位！');
            return;
        }

        if (!this.state.phone || this.state.phone.trim() === '') {
            alert('電話為必填欄位！');
            return;
        }

        if (!this.state.total || this.state.total.trim() === '') {
            alert('金額為必填欄位！');
            return;
        }

        if (!/^\d+$/.test(this.state.total.trim())) {
            alert('金額必須為正整數阿拉伯數字！');
            return;
        }

        const totalNum = parseInt(this.state.total.trim(), 10);
        if (totalNum <= 0) {
            alert('金額必須大於 0！');
            return;
        }

        if (!this.state.handler || this.state.handler.trim() === '') {
            alert('經手人為必填欄位！');
            return;
        }

        const validNames = this.state.names.map(n => n.trim()).filter(n => n.length > 0);
        if (validNames.length === 0) {
            alert('請至少填寫一位信徒姓名！');
            return;
        }

        const payload = {
            lightOid: this.props.lightOid,
            address: this.state.address.trim(),
            category: this.state.category,
            phone: this.state.phone.trim(),
            handler: this.state.handler.trim(),
            total: totalNum,
            names: validNames
        };

        const self = this;
        axios.post('http://localhost:8080/temple/light/receipt', payload)
            .then(function (response) {
                const receiptPrintData = {
                    ...payload,
                    date: new Date()
                };

                self.setState({
                    show: false,
                    showPrint: true,
                    printReceiptData: receiptPrintData
                });

                if (self.props.onReceiptCreated) {
                    self.props.onReceiptCreated();
                }
            })
            .catch(function (error) {
                console.log(error);
                alert('開收據失敗，請檢查後端服務！');
            });
    };

    render() {
        return (
            <div>
                <Button className="Function_Button" bsStyle="link" bsSize="small" onClick={this.handleShow}>
                    <img src="../order.png" alt="create_receipt" />開收據
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose} bsSize="large">
                    <Modal.Header closeButton>
                        <Modal.Title>開立點燈收據 ({this.props.year} 年)</Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *地址:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        name="address"
                                        placeholder="請輸入地址..."
                                        value={this.state.address}
                                        onChange={this.inputOnChange}
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
                                        <option value="光明燈">光明燈</option>
                                        <option value="太歲">太歲</option>
                                    </FormControl>
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *電話:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        name="phone"
                                        placeholder="請輸入聯絡電話..."
                                        value={this.state.phone}
                                        onChange={this.inputOnChange}
                                    />
                                </Col>
                            </FormGroup>

                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *姓名名冊:
                                </Col>
                                <Col sm={8}>
                                    {this.state.names.map((name, index) => (
                                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ width: '60px', color: '#555', fontSize: '13px' }}>
                                                第 {index + 1} 位:
                                            </span>
                                            <FormControl
                                                type="text"
                                                placeholder={`請輸入第 ${index + 1} 位姓名...`}
                                                value={name}
                                                onChange={(e) => this.handleNameChange(index, e.target.value)}
                                                style={{ flex: 1, marginRight: '8px' }}
                                            />
                                            {this.state.names.length > 1 && (
                                                <Button
                                                    bsStyle="danger"
                                                    bsSize="xsmall"
                                                    onClick={() => this.removeNameField(index)}
                                                >
                                                    刪除
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                    <Button
                                        bsStyle="info"
                                        bsSize="small"
                                        onClick={this.addNameField}
                                        style={{ marginTop: '5px' }}
                                    >
                                        + 新增姓名欄位 (最多 16 位)
                                    </Button>
                                    <HelpBlock>收據名冊表格最多可容納 16 位信徒姓名</HelpBlock>
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            {/* 左側：金額與經手人輸入區塊 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '6px', whiteSpace: 'nowrap', color: '#333' }}>
                                        *金額:
                                    </span>
                                    <FormControl
                                        type="text"
                                        name="total"
                                        pattern="[0-9]*"
                                        placeholder="請輸入金額..."
                                        value={this.state.total}
                                        onChange={this.inputValidityOnChange}
                                        style={{ width: '120px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: '6px', whiteSpace: 'nowrap', color: '#333' }}>
                                        *經手人:
                                    </span>
                                    <FormControl
                                        type="text"
                                        name="handler"
                                        placeholder="經手人姓名..."
                                        value={this.state.handler}
                                        onChange={this.inputOnChange}
                                        style={{ width: '120px' }}
                                    />
                                </div>
                            </div>

                            {/* 右側：確認與取消按鈕 */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Button bsStyle="primary" onClick={this.submitReceipt}>確認</Button>
                                <Button onClick={this.handleClose}>取消</Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>

                <PrintLightReceiptModal
                    show={this.state.showPrint}
                    onHide={() => this.setState({ showPrint: false })}
                    receipt={this.state.printReceiptData}
                />
            </div>
        );
    }
}

export default CreateLightReceipt;
