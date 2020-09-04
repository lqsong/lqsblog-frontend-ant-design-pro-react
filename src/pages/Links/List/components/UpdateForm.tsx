import React, { useState, useRef } from 'react';
import { FormattedMessage , useIntl } from 'umi';
import { Modal, Button, Input, Form, message } from 'antd';

import LinksCategorySelect from "@/components/LinksCategorySelect";
import ServerImageSelectionList from '@/components/ServerImage/SelectionList';

import { FormValueType } from '../data.d'
import { updateList } from '../service';


interface UpdateFormProps {
    modalVisible: boolean;
    onCancel: () => void;
    onSuccess?: ()=>void;
    values: Partial<FormValueType>;
    valId: number;
}

const UpdateForm:React.FC<UpdateFormProps> = (props) => {

    const intl = useIntl();

    const { modalVisible, onCancel, onSuccess, valId  } = props;

    const serverImgListRef:React.RefObject<any> = useRef();

    const formVals: FormValueType = {
        title: props.values.title || '',
        description: props.values.description || '',
        categoryId: props.values.categoryId || 0,
        href: props.values.href || '',
        logo: props.values.logo || '',
    };

    // 提交按钮loading
    const [submitLoading, handleSubmitLoading] = useState<boolean>(false); 
    // Logo图片   
    const [serverImageList, handleServerImageList] = useState<string[]>(formVals.logo?[formVals.logo]:[]);

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

            const response =  await updateList(valId, {...formVals, ...values, logo: serverImageList[0]})
            const { code } = response;
            if (code === 0 ) {
                if(onSuccess) onSuccess();
                message.success(intl.formatMessage({ id: 'app.global.message.success.operation' }));
                setTimeout(()=> {
                    hideModalRestForm();  
                },500);
            }

            handleSubmitLoading(false);
        })
        .catch((/* info */) => {
            message.warning(intl.formatMessage({ id: 'app.global.form.validatefields.catch' }));
        });
    };


    return <Modal
        destroyOnClose
        title={intl.formatMessage({ id: 'app.links.updateform.title'})}
        visible={modalVisible}
        onCancel={() => onCancel()}
        footer={[
            <Button key="back" onClick={() => onCancel()}>
              <FormattedMessage id="app.links.updateform.btn-cancel" />
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" loading={submitLoading} onClick={() => onFinish()}>
              <FormattedMessage id="app.links.updateform.btn-submit" />
            </Button>
          ]}
        maskClosable={false}
    >
            <Form
                form={form}
                initialValues={{
                    categoryId: formVals.categoryId,
                    title: props.values.title,
                    href: formVals.href,
                    description: formVals.description,
                }}
                labelCol={ {span: 4} }
                name="updateform"
            >
                <Form.Item 
                    label={<FormattedMessage id="app.links.updateform.form-item-category" />}
                    name="categoryId"
                    rules={[{ required: true , message: intl.formatMessage({ id: 'app.links.updateform.form-item-category-placeholder' })}]}
                >                   
                    <LinksCategorySelect selectedOption={props.values.category} placeholder={intl.formatMessage({id: 'app.links.updateform.form-item-category-placeholder'})} />
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.updateform.form-item-title" />}
                    name="title"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.updateform.form-item-title-placeholder' }) }]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.links.updateform.form-item-title-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.updateform.form-item-href" />}
                    name="href"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.updateform.form-item-href-placeholder' }) }]}
                >
                    <Input placeholder={intl.formatMessage({ id: 'app.links.updateform.form-item-href-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label={<FormattedMessage id="app.links.updateform.form-item-description" />}
                    name="description"
                    rules={[{ required: true, message: intl.formatMessage({ id: 'app.links.updateform.form-item-description-placeholder' }) }]}
                >
                    <Input.TextArea placeholder={intl.formatMessage({ id: 'app.links.updateform.form-item-description-placeholder' })}/>
                </Form.Item>
                <Form.Item
                    label="Logo"
                >
                    <ServerImageSelectionList ref={serverImgListRef} defaultValue={serverImageList} setValue={handleServerImageList} limit={1} />
                </Form.Item>
            </Form>
    </Modal>;


}

export default UpdateForm;