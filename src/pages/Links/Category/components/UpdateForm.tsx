import React from "react";
import { useIntl } from "umi";
import { Modal, Form, Input, InputNumber, Button, message } from "antd";

import { FormInstance } from "antd/lib/form";
import { TableListItem } from "../data.d";

interface UpdateFormProps {
    modalVisible:boolean;
    onCancel: () => void;
    values: Partial<TableListItem>;
    onSubmitLoading:boolean;
    onSubmit: (values: TableListItem, form: FormInstance) => void;
}

const UpdateForm:React.FC<UpdateFormProps> = (props) => {
    const intl = useIntl();

    const { modalVisible, onCancel, values, onSubmitLoading, onSubmit } = props;

    const formVals: TableListItem = {
        id: values.id || 0,
        name: values.name || '',
        alias: values.alias || '',
        sort: values.sort || 0,
    }
    

    const [form] = Form.useForm();


    const onFinish = async () => { 
        try {
            const fieldsValue = await form.validateFields();  
            onSubmit({...formVals, ...fieldsValue}, form);
        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    };


    return (
        <Modal
            destroyOnClose
            title={intl.formatMessage({ id: 'app.linkscategory.updateform.title' })}
            visible={modalVisible}
            onCancel={() => onCancel()}
            maskClosable={false}  
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.linkscategory.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.linkscategory.createform.btn-submit' })}
                </Button>
            ]}          
        >
            <Form
                form={form}
                labelCol={ {span: 4} }
                name="updateform"
                initialValues={
                    {
                        name: formVals.name,
                        alias: formVals.alias,
                        sort: formVals.sort,
                    }
                }
            >
                <Form.Item
                    label={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-name-placeholder' }));
                                } else if (/[,]+/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-name-reg' }));
                                } else if (value.length > 10) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-alias' })}
                    name="alias"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-alias-placeholder' }));
                                } else if (!/^[a-z]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-alias-reg' }));
                                } else if (value.length > 50) {
                                    throw new Error(intl.formatMessage({ id: 'app.linkscategory.createform.form-item-alias-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-alias-placeholder' })}/>
                </Form.Item>

                <Form.Item
                    label={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-sort' })}
                    name="sort"
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'app.linkscategory.createform.form-item-sort-placeholder' })
                        }
                    ]}
                >
                    <InputNumber min={0} max={999} style={{width:'100%'}} placeholder={intl.formatMessage({ id: 'app.linkscategory.createform.form-item-sort-placeholder' })} />
                </Form.Item>

            </Form>

        </Modal>
    );
}


export default UpdateForm;