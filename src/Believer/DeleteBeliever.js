import React from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';

class DeleteBeliever extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            id: '',
            name: ''
        };
    }

    handleShow = () => {
        if (this.props.selectedBeliever === undefined) {
            alert('請先選擇一位信徒!');
            return;
        }
        this.setState({
            show: true,
            id: this.props.selectedBeliever.id,
            name: this.props.selectedBeliever.name || ''
        });
    }

    handleClose = () => {
        this.setState({
            show: false,
            id: '',
            name: ''
        });
    }

    submitBeliever = () => {
        let self = this;
        axios.delete(`http://localhost:8080/temple/believer/${this.state.id}`)
            .then(function (response) {
                self.handleClose();
                self.props.getAllBeliever();
            })
            .catch(function (error) {
                console.log(error);
                alert('刪除失敗，請檢查後端服務！');
            });
    }

    render() {
        return (
            <div>
                <Button className="Function_Button" bsStyle="link" bsSize="small" onClick={this.handleShow}>
                    <img src="../delete.png" alt="delete_believer"/>刪除信徒
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>刪除信徒</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            {this.state.name ? `確定要刪除信徒「${this.state.name}」嗎？` : '確定要刪除此信徒？'}
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

export default DeleteBeliever;
