import React from 'react';
import { ZoomInOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Avatar,Modal } from 'antd';
import classNames from 'classnames';
import ServerImageModal from '../Modal';

import styles from './index.less';

interface ServerImageSelectionListProps {
    defaultValue: string[];
    setValue: (value: string[]) => void;
    limit?: number;    
}
interface ServerImageSelectionListState {
    listValue: string[];
    picViewVal: string;
    previewVisible: boolean;
    modalVisible: boolean;
}

class ServerImageSelectionList extends React.Component<ServerImageSelectionListProps, ServerImageSelectionListState> {

    constructor(props: ServerImageSelectionListProps) {
        super(props);
        this.state = {
            listValue: props.defaultValue,
            picViewVal: '',
            previewVisible: false,
            modalVisible: false,
        };

    }

    // 设置图片列表
    setListValue = (v: string[]): void => {  
        this.setState({ listValue: v });
        this.props.setValue(v);
    }
   
    // 添加图片列表
    addListValue = (v: string): void => {
        const { listValue } = this.state;
        const arr:string[] = listValue;
        arr.push(v);
        this.setListValue(arr);
    }
    
    // 图片列表 - 显示弹框
    handlePreviewVisible = (v: boolean): void => {
        this.setState({ previewVisible: v });
    }

    // 图片列表 - 查看大图
    handlePicturePreview = (v: string): void => {  
        this.setState({
            picViewVal: v,
            previewVisible: true
        });
    }

    // 图片列表 - 删除
    handlePictureDel = (index: number): void => {
        const { listValue } = this.state;
        const arr:string[] = listValue;
        arr.splice(index,1);
        this.setListValue(arr);
    }

    // 图片弹框列表 - 
    handleModalVisible = (b: boolean): void => {
        this.setState({modalVisible: b});
    }

    render() {
        const { limit = 1 } = this.props;
        const { listValue, picViewVal, previewVisible, modalVisible } = this.state;

        return (
            <>
                { 
                listValue.map((item,index) => {
                    const keys = item + index
                    return (
                        <div className={classNames(styles.imglist)} key={keys} >            
                            <Avatar className={classNames(styles.item)} shape="square" size={120} src={item} />
                            <div className={classNames(styles.btn)}>
                                <ZoomInOutlined className={classNames(styles['zoom-in'])} onClick={() => this.handlePicturePreview(item)}/>
                                <DeleteOutlined  className={classNames(styles.delete)} onClick={() => this.handlePictureDel(index)}/>
                            </div>
                        </div>
                    )
                })
                }
                { 
                (listValue.length < limit) && (
                    <span onClick={() => { this.handleModalVisible(true); }}>
                        <Avatar className={classNames(styles.upload)} shape="square" size={120} icon={<PlusOutlined />}  />
                    </span>
                )
                }
                <Modal
                    visible={previewVisible}
                    title=""
                    footer={null}
                    onCancel={()=> this.handlePreviewVisible(false)}
                    width="700px"
                    >
                    <img alt="" style={{ width: '100%' }} src={picViewVal} />
                </Modal>
                <ServerImageModal modalVisible={modalVisible} onCancel={() => this.handleModalVisible(false)} chooseImg={(url) =>{this.addListValue(url)}}/>
            </>
        );
    }
}

export default ServerImageSelectionList;