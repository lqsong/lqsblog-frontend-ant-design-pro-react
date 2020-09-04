import React, { useState, useRef } from 'react';
import {  FormattedMessage, useIntl } from 'umi';
import { Modal, Form, Input, Button, message } from 'antd';

import LinksCategorySelect from '@/components/LinksCategorySelect';
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';

import { FormValueType } from '../data.d'
import { addList } from '../service';

interface CreateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSuccess?: ()=>void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
    
    const intl = useIntl();

    const { modalVisible, onCancel } = props;

    const serverImgListRef:React.RefObject<any> = useRef();

    // 提交按钮loading
    const [submitLoading, handleSubmitLoading] = useState<boolean>(false); 
    // Logo图片   
    const [serverImageList, handleServerImageList] = useState<string[]>([]);

    const formVals: FormValueType = {
        title: '',
        description: '',
        categoryId: 0,
        href: '',
        logo: '',
    };

    const [form] = Form.useForm();

    const hideModalRestForm = () :void => {
        form.resetFields();
        serverImgListRef.current.setListValue([]); 
        onCancel()  
    }    

    const onFinish = (): void => {        
        form
        .validateFields()
        .then(async (values) => {
            handleSubmitLoading(true);

            const response =  await addList({...formVals, ...values, logo: serverImageList[0]})
            const { code } = response;
            if (code === 0 ) {
                hideModalRestForm();  
                message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
                if(props.onSuccess) props.onSuccess();
            }

            handleSubmitLoading(false);
        })
        .catch((/* info */) => {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        });
    };


    return (
        <Modal
          destroyOnClose
          title={<FormattedMessage id="app.links.createform.title" />}
          visible={modalVisible}
          onCancel={() => hideModalRestForm()}
          footer={[
            <Button key="back" onClick={() => hideModalRestForm()}>
              <FormattedMessage id="app.links.createform.btn-cancel" />
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" loading={submitLoading} onClick={() => onFinish()}>
              <FormattedMessage id="app.links.createform.btn-submit" />
            </Button>
          ]}
          maskClosable={false}
        >
            <Form
                form={form}
                labelCol={ {span: 4} }
                name="basic"
            >
                <Form.Item 
                    label={<FormattedMessage id="app.links.createform.form-item-category" />}
                    name="categoryId"
                    rules={[{ required: true , message: intl.formatMessage({ id: 'app.links.createform.form-item-category-placeholder' })}]}
                >                   
                    <LinksCategorySelect placeholder={intl.formatMessage({id: 'app.links.createform.form-item-category-placeholder'})} />
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.createform.form-item-title" />}
                    name="title"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.createform.form-item-title-placeholder' }) }]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.links.createform.form-item-title-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.createform.form-item-href" />}
                    name="href"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.createform.form-item-href-placeholder' }) }]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.links.createform.form-item-href-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.createform.form-item-description" />}
                    name="description"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.createform.form-item-description-placeholder' }) }]}
                >
                    <Input.TextArea placeholder={intl.formatMessage({ id: 'app.links.createform.form-item-description-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label="Logo"
                >
                    <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={1} />
                </Form.Item>
            </Form>
        </Modal>
      );
}

export default CreateForm;