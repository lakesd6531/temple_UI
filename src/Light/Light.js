import React from 'react';
import axios from 'axios';
import { Button, Modal, Form, FormControl, FormGroup, Col, ControlLabel } from 'react-bootstrap';
import LightDetail from './LightDetail.js';

class Light extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lightList: [],
            showAddYear: false,
            newYear: '',
            selectedLight: null
        };
    }

    componentDidMount() {
        this.getAllLight();
    }

    getAllLight = () => {
        const self = this;
        axios.get('http://localhost:8080/temple/light')
            .then(function (response) {
                self.setState({ lightList: response.data || [] });
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    handleShowAddYear = () => {
        this.setState({
            showAddYear: true,
            newYear: ''
        });
    };

    handleCloseAddYear = () => {
        this.setState({
            showAddYear: false,
            newYear: ''
        });
    };

    handleYearChange = (e) => {
        this.setState({ newYear: e.target.value });
    };

    submitAddYear = () => {
        const yearStr = this.state.newYear.trim();
        if (!yearStr) {
            alert('年份為必填欄位！');
            return;
        }

        if (!/^\d{4}$/.test(yearStr)) {
            alert('請輸入合法的 4 位數西元年份 (例如 2026)！');
            return;
        }

        const self = this;
        axios.post('http://localhost:8080/temple/light', { year: yearStr })
            .then(function () {
                self.handleCloseAddYear();
                self.getAllLight();
            })
            .catch(function (error) {
                console.log(error);
                alert('新增年份失敗，請檢查後端服務！');
            });
    };

    handleSelectYearBox = (light) => {
        this.setState({ selectedLight: light });
    };

    handleBackToList = () => {
        this.setState({ selectedLight: null });
    };

    render() {
        if (this.state.selectedLight) {
            return (
                <LightDetail
                    lightOid={this.state.selectedLight.id}
                    year={this.state.selectedLight.year}
                    onBack={this.handleBackToList}
                />
            );
        }

        return (
            <div>
                {/* 頂部功能按鈕 */}
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '20px' }}>
                    <Button
                        className="Function_Button"
                        bsStyle="link"
                        bsSize="small"
                        onClick={this.handleShowAddYear}
                    >
                        <img src="../add.png" alt="add_year" />新增年份
                    </Button>
                </div>

                {/* 年份方框卡片列表 (依年份最新排前面) */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '20px',
                    padding: '10px 0'
                }}>
                    {this.state.lightList.length === 0 ? (
                        <div style={{ color: '#888', padding: '20px', fontSize: '16px' }}>
                            尚無任何年份資料，請點擊上方「新增年份」建立！
                        </div>
                    ) : (
                        this.state.lightList.map((light) => (
                            <div
                                key={light.id}
                                onClick={() => this.handleSelectYearBox(light)}
                                style={{
                                    width: '160px',
                                    height: '110px',
                                    backgroundColor: '#ffffff',
                                    border: '2px solid #007bff',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.15)',
                                    transition: 'all 0.2s ease-in-out',
                                    userSelect: 'none'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 123, 255, 0.3)';
                                    e.currentTarget.style.backgroundColor = '#f0f7ff';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 123, 255, 0.15)';
                                    e.currentTarget.style.backgroundColor = '#ffffff';
                                }}
                            >
                                <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#007bff' }}>
                                    {light.year}
                                </span>
                                <span style={{ fontSize: '14px', color: '#666', marginTop: '6px' }}>
                                    點燈管理 →
                                </span>
                            </div>
                        ))
                    )}
                </div>

                {/* 新增年份 Dialog */}
                <Modal show={this.state.showAddYear} onHide={this.handleCloseAddYear}>
                    <Modal.Header closeButton>
                        <Modal.Title>新增點燈年份</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form horizontal>
                            <FormGroup>
                                <Col componentClass={ControlLabel} sm={3}>
                                    *西元年份:
                                </Col>
                                <Col sm={8}>
                                    <FormControl
                                        type="text"
                                        placeholder="請輸入西元年 (例: 2026)..."
                                        value={this.state.newYear}
                                        onChange={this.handleYearChange}
                                        maxLength={4}
                                    />
                                </Col>
                            </FormGroup>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button bsStyle="primary" onClick={this.submitAddYear}>確認</Button>
                        <Button onClick={this.handleCloseAddYear}>取消</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

export default Light;
