import React from 'react';
import { useIntl } from "umi";
import { Modal, Form, Input, Button, message } from 'antd';

import { FormInstance } from 'antd/lib/form';
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
        alias: values.alias || '',
        title: values.title || '',
        keywords: values.keywords || '',
        description: values.description || '',
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
            title={intl.formatMessage({ id: 'app.articlecategory.createform.title' })}
            visible={ modalVisible }
            onCancel={ onCancel }  
            footer={[
                <Button key="back" onClick={() => onCancel()}>
                  {intl.formatMessage({ id: 'app.articlecategory.createform.btn-cancel' })}
                </Button>,
                <Button key="submit" type="primary" htmlType="submit" loading={onSubmitLoading} onClick={() => onFinish()}>
                  {intl.formatMessage({ id: 'app.articlecategory.createform.btn-submit' })}
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
                        alias: formVals.alias,
                        title: formVals.title,
                        keywords: formVals.keywords,
                        description: formVals.keywords,
                        pname: formVals.pname,
                    }
                }
            >
                <Form.Item
                    label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-name' })}
                    name="name"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.articlecategory.createform.form-item-name-placeholder' }));
                                } else if (value.length > 8) {
                                    throw new Error(intl.formatMessage({ id: 'app.articlecategory.createform.form-item-name-length' }));
                                }
                            }
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-name-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-alias' })}
                    name="alias"
                    rules={[
                        {
                            required: true,
                            validator: async (rule, value) => {
                                if (value === '' || !value) {
                                    throw new Error(intl.formatMessage({ id: 'app.articlecategory.createform.form-item-alias-placeholder' }));
                                } else if (!/^[a-z0-9]+$/.test(value)) {
                                    throw new Error(intl.formatMessage({ id: 'app.articlecategory.createform.form-item-alias-reg' }));
                                } else if (value.length > 10) {
                                    throw new Error(intl.formatMessage({ id: 'app.articlecategory.createform.form-item-alias-length' }));
                                }
                            },
                        }
                    ]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-alias-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-title' })}
                    name="title"
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-title-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-keywords' })}
                    name="keywords"
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-keywords-placeholder' })} />
                </Form.Item>
                <Form.Item
                    label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-description' })}
                    name="description"
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-description-placeholder' })} />
                </Form.Item>
                <Form.Item
                   label={intl.formatMessage({ id: 'app.articlecategory.createform.form-item-pname' })}
                   name="pname"
                >
                    <Input disabled />
                </Form.Item>
            </Form>

        </Modal>
    )


}


export default CreateForm;