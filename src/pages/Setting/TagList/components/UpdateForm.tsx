import React from "react";
import { useIntl } from "umi";
import { Modal, Form, Input, Button, message } from "antd";

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
        pinyin: values.pinyin || '',
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
            maskClosable={false}
            title={intl.formatMessage({ id: 'app.settingtaglist.updateform.title' })}
            visible={ modalVisible }
            onCancel={ onCancel }
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.settingtaglist.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.settingtaglist.createform.btn-submit' })}
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
                        pinyin: formVals.pinyin,
                    }
                }
            >

                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-name-placeholder' }));
                                } else if (/[,]+/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-name-reg' }));
                                } else if (value.length > 10) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-pinyin' })}
                    name="pinyin"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-pinyin-placeholder' }));
                                } else if (!/^[a-z]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-pinyin-reg' }));
                                } else if (value.length > 60) {
                                    throw new Error(intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-pinyin-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.settingtaglist.createform.form-item-pinyin-placeholder' })}/>
                </Form.Item>
               

            </Form>

        </Modal>
    );

}


export default UpdateForm;