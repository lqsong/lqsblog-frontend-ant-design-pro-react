import React from "react";
import { useIntl } from 'umi'
import { Modal, Form, Input, Button, message } from "antd";

import { FormInstance } from "antd/lib/form";
import { TableListItem } from "../data";



interface UpdateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    values: Partial<TableListItem>;
    onSubmitLoading: boolean;
    onSubmit: (values: TableListItem, form: FormInstance) => void;

}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {

    const intl = useIntl();

    const { modalVisible, onCancel, values, onSubmitLoading, onSubmit } = props;

    const formVals: TableListItem = {
        id: values.id || 0,
        name: values.name || '',
        permission: values.permission || '',
        pid: values.pid || 0,
        pname: values.pname || '',
    }

    const [form] = Form.useForm();

    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields();  
            onSubmit({...formVals, ...fieldsValue}, form);
        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }




    return (
        <Modal
            destroyOnClose
            maskClosable={ false }
            title={intl.formatMessage({ id: 'app.settingapilist.updateform.title' })}
            visible = {modalVisible}
            onCancel={ onCancel }
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                 {intl.formatMessage({ id: 'app.settingapilist.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.settingapilist.createform.btn-submit' })}
                </Button>
            ]}    
        >

            <Form
                form={form}
                name="updateform"
                labelCol={ {span: 6} }
                initialValues={
                    {
                        name: formVals.name,
                        permission: formVals.permission,
                        pname: formVals.pname,
                    }
                }
            >
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingapilist.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingapilist.createform.form-item-name-placeholder' }));
                                } else if (value.length > 8) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingapilist.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingapilist.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingapilist.createform.form-item-permission' })}
                    name="permission"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingapilist.createform.form-item-permission-placeholder' }));
                                } else if (!/^[a-z0-9/:]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingapilist.createform.form-item-permission-reg' }));
                                } else if (value.length > 80) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingapilist.createform.form-item-permission-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingapilist.createform.form-item-permission-placeholder' })} />
                </Form.Item>
                <Form.Item
                   label={intl.formatMessage({ id: 'app.settingapilist.createform.form-item-pname' })}
                   name="pname"
                >
                    <Input disabled />
                </Form.Item>
            </Form>
        
        </Modal>
    );
}

export default UpdateForm;