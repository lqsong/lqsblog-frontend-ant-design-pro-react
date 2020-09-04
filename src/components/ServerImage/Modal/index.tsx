import React, { useState, useEffect } from 'react';
import {  FormattedMessage, useIntl } from 'umi';
import { Modal, Table, Row, Col, Pagination, Upload, Button, Popover, Form, Input, message  } from 'antd';
import { ColumnProps } from 'antd/es/table';
import {isExternal} from '@/utils/validate';
import { getAjaxHeaderToken, AJAX_HEADER_TOKEN_KEY } from '@/utils/authority';
import { ImgListParams } from '../data.d';
import { queryImgList } from '../service';


interface ServerImageModalProps {
    modalTitle?: string;
    modalWidth?: string;
    modalVisible: boolean;
    onCancel: () => void;
    chooseImg: (url: string) => void;
}

interface ImgList {
    id: number;
    imgurl: string;
    size: string;
}

const ServerImageModal: React.FC<ServerImageModalProps> = (props) => {
    const intl = useIntl();

    const { modalTitle= intl.formatMessage({id: 'components.serverimage.modal.title'}), modalWidth="780px", modalVisible, onCancel, chooseImg } = props;

    // 外链 - Popover
    const [popoverVisible, handlePopoverVisible] = useState<boolean>(false); 
    // 外链 - 表单
    const [form] = Form.useForm();
    // 外链 - 表单 - 设置外链提交
    const setOutsideImg = (): void => {        
        form
        .validateFields()
        .then(values => {
            chooseImg(values.url);
            form.resetFields();
            handlePopoverVisible(false);
            onCancel(); 
        })
    };

    const tablePageSize: number = 5;

    const [tableLoading, handleTableLoading] = useState<boolean>();
    const [tableCurrent, handleTableCurrent] = useState<number>(2);
    const [tableTotal, handleTableTotal] = useState<number>(0);
    const [tableData, handleTableData] = useState<ImgList[]>([]);


    const columns: ColumnProps<ImgList>[] = [
        {
            title: intl.formatMessage({id: 'components.serverimage.modal.table-img'}),
            dataIndex: 'imgurl',
            width:'120px',
            ellipsis: true,
            render: text => {
                return <a target="_blank" rel="noreferrer" href={text}>
                    <img alt="" src={text} width="70" height="70" />
                </a>
            }
        },
        {
            title: intl.formatMessage({id: 'components.serverimage.modal.table-size'}),
            dataIndex: 'size',
            ellipsis: true,
        },
        {
            title: intl.formatMessage({id: 'components.serverimage.modal.table-option'}),
            dataIndex: 'option',
            width:'120px',
            render: (_, record) => {
                return <Button type="primary" onClick={()=> {
                    chooseImg(record.imgurl);
                    onCancel(); 
                }}>
                    <FormattedMessage id="components.serverimage.modal.table-option-btn" />
                </Button>
            }
        }
    ];


    const setTableData = async (params: ImgListParams) => {
        handleTableLoading(true);
        const res = await queryImgList(params);
        const {code, data} = res;
        if(code ===0) {
            const {list, total} = data;
            handleTableCurrent(params.page || 1);
            handleTableData(list);
            handleTableTotal(total);
        }
        handleTableLoading(false);
    }

    const pageChange = (page: number,pageSize: number | undefined): void => {
        setTableData({per: pageSize, page});
    }


    const [uploadLoading, handleUploadLoading] = useState<boolean>(false);

    const uploadIsFileType: string[] = ['image/png','image/gif','image/jpeg'];
    const uploadMaxSize: number = 1; // 单位M
    const headers = {};
    const getToken = getAjaxHeaderToken();
    if (getToken) {
        headers[AJAX_HEADER_TOKEN_KEY] = getToken;
    }
    const uploadProps = {
        showUploadList: false,
        action: `${API_HOST}/upload/images`,
        headers,
        beforeUpload(file: any): boolean {
            const isType: boolean = uploadIsFileType.length > 0 ? uploadIsFileType.includes(file.type) : true;
            if(!isType) {
                message.error(`You can only upload ${  uploadIsFileType.join('、')  } file!`);
                return false;
            }

            const isLtMaxSize: boolean = file.size / 1024 / 1024 < uploadMaxSize;
            if (!isLtMaxSize) {
                message.error(`Upload image size should not exceed ${  uploadMaxSize  }M!`);
                return false;
            }  

            

            return true;

        },
        onChange(info: any): void {
            if (info.file.status === 'uploading') {
                handleUploadLoading(true);
                return;
            } if(info.file.status === 'done') {
                setTableData({per: tablePageSize, page: 1});
                message.success(`${info.file.name} file uploaded successfully`);
            } else if(info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
            handleUploadLoading(false);
        },
    }


    useEffect(() => {
        setTableData({per: tablePageSize, page: 1});
    },[])


    return (
        <Modal
            visible={modalVisible}
            onCancel={()=> onCancel()}
            title={modalTitle}
            width={modalWidth}
            footer={
                <Row>
                    <Col span={6} style={{textAlign:'left'}}>
                        <Popover
                            content={
                                <Form
                                    form={form}
                                    layout="vertical"
                                    name="imglist"
                                >
                                    <Form.Item
                                        required
                                        label={intl.formatMessage({id: 'components.serverimage.modal.form-url'})}
                                        name="url"
                                        rules={[
                                            {
                                                validator: async (rule, value) => {
                                                    if (!value) {
                                                        return Promise.reject(new Error(intl.formatMessage({ id: 'components.serverimage.modal.form-url-rule-required' })));
                                                    } if (!isExternal(value)) {
                                                        return Promise.reject(new Error(intl.formatMessage({ id: 'components.serverimage.modal.form-url-rule-isexternal' })));
                                                    }
                                                        return Promise.resolve();
                                                    
                                                }
                                            }
                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button style={{ marginRight: '5px'}} onClick={setOutsideImg}>
                                            <FormattedMessage id="components.serverimage.modal.form-btn-confirm" />
                                        </Button>
                                        <Button onClick={()=> handlePopoverVisible(false)}>
                                            <FormattedMessage id="components.serverimage.modal.form-btn-cancel" />
                                        </Button>
                                    </Form.Item>
                                </Form>
                            }
                            title=""
                            trigger="click"
                            visible={popoverVisible}
                            onVisibleChange={v=> handlePopoverVisible(v)}
                        >
                            <Button type="primary" style={{float: 'left', marginRight: '5px'}}>
                                <FormattedMessage id="components.serverimage.modal.btn-qutside" />
                            </Button>
                        </Popover>
                        <Upload { ...uploadProps } >
                            <Button type="primary" loading={uploadLoading}>
                                <FormattedMessage id="components.serverimage.modal.btn-upload" />
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={18}>
                        <Pagination showTotal={total => intl.formatMessage({id: 'components.serverimage.modal.pagination-total'},{total})} total={tableTotal} current={tableCurrent} pageSize={tablePageSize} onChange={pageChange} showSizeChanger={false} />
                    </Col>
                </Row>
            }
            >
            <Table<ImgList> bordered  size="small" rowKey="id" pagination={false} loading={tableLoading}  columns={columns} dataSource={tableData} scroll={{ y: 240 }}/>
        </Modal>
    );
}

export default ServerImageModal;