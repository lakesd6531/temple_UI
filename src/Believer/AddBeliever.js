import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

class CustomDateButton extends React.Component {
    render() {
        return (
            <Button
                type="button"
                bsSize="small"
                onClick={this.props.onClick}
                title="選擇國曆生日"
                style={{ padding: '4px 10px', height: '34px', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <span role="img" aria-label="calendar">📅</span>
            </Button>
        );
    }
}

class AddBeliever extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            show : false,
            name : '',
            phone : '',
            cellPhone : '',
            address : '',
            birthday : '',
            selectedDate : null,
            idNumber : ''
        };
    }

    handleShow = () => {
        this.setState({show : true});
    }

    handleClose = () => {
        this.setState({
            show : false,
            name : '',
            phone : '',
            cellPhone : '',
            address : '',
            birthday : '',
            selectedDate : null,
            idNumber : ''
        });
    }

    inputOnChange = (e) => {
        var key = e.target.name;
        var value = e.target.value;
        if (key === 'birthday') {
            const m = moment(value, 'YYYY/MM/DD', true);
            this.setState({
                birthday: value,
                selectedDate: m.isValid() ? m.toDate() : null
            });
        } else {
            this.setState({
                [key]: value
            });
        }
    }

    handleDateChange = (date) => {
        if (date) {
            const formatted = moment(date).format('YYYY/MM/DD');
            this.setState({
                birthday: formatted,
                selectedDate: date
            });
        } else {
            this.setState({
                birthday: '',
                selectedDate: null
            });
        }
    }

    submitBeliever = () => {
        if(this.state.name === ''){
            alert('信徒姓名為必填欄位!');
            return;
        }

        if(this.state.phone === ''){
            alert('聯絡電話為必填欄位!');
            return;
        }

        if(this.state.cellPhone === ''){
            alert('行動電話為必填欄位!');
            return;
        }

        if(this.state.address === ''){
            alert('地址為必填欄位!');
            return;
        }

        if(this.state.birthday && this.state.birthday.trim() !== ''){
            const trimmedBirthday = this.state.birthday.trim();
            const regex = /^\d{4}\/\d{2}\/\d{2}$/;
            if(!regex.test(trimmedBirthday) || !moment(trimmedBirthday, 'YYYY/MM/DD', true).isValid()){
                alert('國曆生日格式不正確，格式必須為 yyyy/mm/dd (例如: 1995/01/26)');
                return;
            }
        }

        let self = this;
        axios.post('http://localhost:8080/temple/believer',{
            name : this.state.name,
            phone : this.state.phone,
            cellPhone : this.state.cellPhone,
            address : this.state.address,
            birthday : this.state.birthday ? this.state.birthday.trim() : '',
            idNumber : this.state.idNumber
        }).then(function (response) {
            self.handleClose();
            self.props.getAllBeliever();
        }).catch(function (error){
            console.log(error);
        });
    }

    render(){
        return (
            <div>
                <Button className="Function_Button" bsStyle="link" bsSize="small" onClick={this.handleShow}>
                    <img src="../add.png" alt="add_believer"/>新增信徒
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>新增信徒</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    *姓名:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="input" type="text" name="name" onInput={this.inputOnChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    *電話:
                                </Col>
                                <Col sm={4}>
                                    <FormControl componentClass="input" type="text" name="phone" onInput={this.inputOnChange}/>
                                </Col>
                                <Col componentClass={ControlLabel} sm={2}>
                                    *手機:
                                </Col>
                                <Col sm={4}>
                                    <FormControl componentClass="input" type="text" name="cellPhone" onInput={this.inputOnChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    國曆生日:
                                </Col>
                                <Col sm={4}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <FormControl
                                            componentClass="input"
                                            type="text"
                                            name="birthday"
                                            placeholder="yyyy/mm/dd"
                                            value={this.state.birthday}
                                            onChange={this.inputOnChange}
                                            style={{ width: '130px', marginRight: '6px' }}
                                        />
                                        <DatePicker
                                            selected={this.state.selectedDate}
                                            onChange={this.handleDateChange}
                                            dateFormat="yyyy/MM/dd"
                                            customInput={<CustomDateButton />}
                                            showYearDropdown
                                            showMonthDropdown
                                            dropdownMode="select"
                                            scrollableYearDropdown
                                            yearDropdownItemNumber={100}
                                        />
                                    </div>
                                </Col>
                                <Col componentClass={ControlLabel} sm={2}>
                                    身分證號:
                                </Col>
                                <Col sm={4}>
                                    <FormControl componentClass="input" type="text" name="idNumber" value={this.state.idNumber} onChange={this.inputOnChange}/>
                                </Col>
                            </FormGroup>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={2}>
                                    *地址:
                                </Col>
                                <Col sm={10}>
                                    <FormControl componentClass="input" type="text" name="address" onInput={this.inputOnChange}/>
                                </Col>
                            </FormGroup>
                            <Col componentClass={ControlLabel}>
                                (備註: * 為必填欄位)
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submitBeliever}>確認</Button>
                        <Button onClick={this.handleClose}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
export default AddBeliever;
