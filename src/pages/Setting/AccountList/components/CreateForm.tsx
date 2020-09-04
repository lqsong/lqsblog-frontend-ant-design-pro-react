import React from "react";
import { useIntl } from "umi";
import { Modal, Form, Input, Button,message } from "antd";

import { FormInstance } from "antd/lib/form";
import RoleSelect from '@/components/RoleSelect';
import { FormValueType } from "../data.d";


interface CreateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmitLoading: boolean;
    onSubmit: (values: FormValueType, form: FormInstance) => void;
}

const formVals: FormValueType = {
    username: '',
    nickname: '',
    password: '',
    roles: [],
}

const CreateForm:React.FC<CreateFormProps> = (props) => {

    const intl = useIntl();

    const { modalVisible, onCancel, onSubmitLoading, onSubmit } = props;

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
            maskClosable={false}
            title={intl.formatMessage({ id: 'app.settingaccountlist.createform.title' })}
            visible={ modalVisible }
            onCancel={ onCancel }
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.settingaccountlist.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.settingaccountlist.createform.btn-submit' })}
                </Button>
              ]}
        >

            <Form
                form={form}
                labelCol={ {span: 4} }
                name="createform"
                initialValues={
                    {
                    }
                }
            >

                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-nickname' })}
                    name="nickname"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-nickname-placeholder' }));
                                } else if (value.length > 8) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-nickname-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-nickname-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-username' })}
                    name="username"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-username-placeholder' }));
                                } else if (!/^[a-z0-9]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-username-reg' }));
                                } else if (value.length < 6 || value.length > 16) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-username-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-username-placeholder' })}/>
                </Form.Item>
               
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-password' })}
                    name="password"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-password-placeholder' }));
                                } else if (!/^[A-Za-z0-9.]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-password-reg' }));
                                } else if (value.length < 6 || value.length > 16) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-password-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input.Password placeholder={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-password-placeholder' })}/>
                </Form.Item>


                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-roles' })}
                    name="roles"
                >
                    <RoleSelect placeholder={intl.formatMessage({ id: 'app.settingaccountlist.createform.form-item-roles-placeholder' })}/>
                </Form.Item>




            </Form>

        </Modal>
    );
}

export default CreateForm;