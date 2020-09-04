import React from "react";
import { useIntl } from "umi";
import { Modal, Form, Input, Button,message } from "antd";

import { FormInstance } from "antd/lib/form";
import MenuTreeSelect from '@/components/MenuTreeSelect';
import { arrayItemSpiltNewArray } from '@/utils/array';
import { FormValueType } from "../data.d";


interface CreateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSubmitLoading: boolean;
    onSubmit: (values: FormValueType, form: FormInstance) => void;
}

const formVals: FormValueType = {
    name:'',
    description: '',
    resources: '',
    resourcesLevel: '',
}

const CreateForm:React.FC<CreateFormProps> = (props) => {

    const intl = useIntl();

    const { modalVisible, onCancel, onSubmitLoading, onSubmit } = props;

    const [form] = Form.useForm();

    const onFinish = async () => { 
        try {
            const fieldsValue = await form.validateFields();  
            const { menu, ...fields } = fieldsValue;
            const resources = arrayItemSpiltNewArray(menu).join(',');
            const resourcesLevel = menu.join(',');
            onSubmit({ ...formVals, ...fields, resources, resourcesLevel }, form);
        } catch (error) {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        }
    };


    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            title={intl.formatMessage({ id: 'app.settingrolelist.createform.title' })}
            visible={ modalVisible }
            onCancel={ onCancel }
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.settingrolelist.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.settingrolelist.createform.btn-submit' })}
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
                    label={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-name-placeholder' }));
                                } else if (/[,]+/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-name-reg' }));
                                } else if (value.length > 10) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-description' })}
                    name="description"
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-description-placeholder' })}/>
                </Form.Item>

                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-menu' })}
                    name="menu"
                >
                    <MenuTreeSelect style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-menu-placeholder' })} />
                </Form.Item>


            </Form>

        </Modal>
    );
}

export default CreateForm;