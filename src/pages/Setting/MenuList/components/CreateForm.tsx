import React from 'react';
import { useIntl } from "umi";
import { Modal, Form, Input, Button, message } from 'antd';

import { FormInstance } from 'antd/lib/form';

import MenuTypeSelect from "@/components/MenuTypeSelect";
import ApiTreeSelect from "@/components/ApiTreeSelect";
import { arrayItemSpiltNewArray } from '@/utils/array';
import { TableListItem, FormValueType } from '../data.d';


interface CreateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    values: Partial<TableListItem>;
    onSubmitLoading: boolean;
    onSubmit: (values: FormValueType, form: FormInstance) => void;
}

const CreateForm:React.FC<CreateFormProps> = (props) => {

    const intl = useIntl()

    const { modalVisible, onCancel, values, onSubmitLoading, onSubmit } = props;

    const formVals: FormValueType = {
        // id: values.id || 0,
        name: values.name || '',
        urlcode: values.urlcode || '',
        perms: values.perms || '',
        permsLevel: values.permsLevel || '',  
        type: values.type || 1,      
        pid: values.pid || 0,
        pname: values.pname || '',
    }

    const [form] = Form.useForm();


    const onFinish = async () => {
        try {
            const fieldsValue = await form.validateFields(); 
            const { api, ...fields } = fieldsValue;
            const perms = arrayItemSpiltNewArray(api).join(',');
            const permsLevel = api.join(',');
            onSubmit({ ...formVals, ...fields, perms, permsLevel }, form);
        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    }


    return (
        <Modal
            destroyOnClose
            maskClosable={ false }
            title={intl.formatMessage({ id: 'app.settingmenulist.createform.title' })}
            visible={ modalVisible }
            onCancel={ onCancel }  
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.settingmenulist.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.settingmenulist.createform.btn-submit' })}
                </Button>
            ]}            
        >
            <Form
                form={form}
                name="createform"
                labelCol={ {span: 6} }
                initialValues={
                    {
                        name: formVals.name,
                        urlcode: formVals.urlcode,
                        type: formVals.type,
                        api: [],
                        pname: formVals.pname,
                    }
                }
            >
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-name-placeholder' }));
                                } else if (value.length > 8) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-urlcode' })}
                    name="urlcode"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-urlcode-placeholder' }));
                                } else if (!/^[a-z0-9/:]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-urlcode-reg' }));
                                } else if (value.length > 80) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-urlcode-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-urlcode-placeholder' })} />
                </Form.Item>

                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-type' })}
                    name="type"
                    rules={[
                        {
                            required: true,
                            message: intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-type-placeholder' })
                        }
                    ]}
                >
                    <MenuTypeSelect placeholder={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-type-placeholder' })} />
                </Form.Item>

                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-api' })}
                    name="api"
                >
                    <ApiTreeSelect style={{ width: '100%' }}  placeholder={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-api-placeholder' })} />
                </Form.Item>


                <Form.Item
                   label={intl.formatMessage({ id: 'app.settingmenulist.createform.form-item-pname' })}
                   name="pname"
                >
                    <Input disabled />
                </Form.Item>
            </Form>

        </Modal>
    )


}


export default CreateForm;