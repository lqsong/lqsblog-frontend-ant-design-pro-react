import React from "react";
import { useIntl } from "umi";
import { Modal, Form, Input, Button, message } from "antd";

import { FormInstance } from "antd/lib/form";
import MenuTreeSelect from '@/components/MenuTreeSelect';
import { arrayItemSpiltNewArray } from '@/utils/array';
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
        description: values.description || '',
        resources: values.resources || '',
        resourcesLevel: values.resourcesLevel || '',
    }
    

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
            title={intl.formatMessage({ id: 'app.settingrolelist.updateform.title' })}
            visible={modalVisible}
            onCancel={() => onCancel()}
            maskClosable={false}  
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
                name="updateform"
                initialValues={
                    {
                        name: formVals.name,
                        description: formVals.description,
                        menu: formVals.resourcesLevel.split(','),
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
                    <MenuTreeSelect style={{ width: '100%' }} placeholder={intl.formatMessage({ id: 'app.settingrolelist.createform.form-item-menu-placeholder' })}/>
                </Form.Item>


            </Form>

        </Modal>
    );
}


export default UpdateForm;