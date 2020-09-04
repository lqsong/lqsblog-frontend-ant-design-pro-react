import React, { useState, useEffect, useImperativeHandle } from 'react';
import request from '@/utils/request';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';

import Editor, { EditorOptions } from '@toast-ui/editor';
import codeSyntaxHightlight from '@toast-ui/editor-plugin-code-syntax-highlight';
// import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/github.css';

interface TuiEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    height?: string;
}

const TuiEditor = React.forwardRef<any, TuiEditorProps>(({ value, onChange, placeholder, height }, ref) => {


    const rootEl = React.createRef<any>();

    const [editor, setEditor] = useState<Editor>();

    let sEditor: Editor;

    /* 
    const getValue = (): string => {
        return editor ? editor.getMarkdown() : '';
    }   
    */  

    const initEditor = (): void => {
        const options: EditorOptions = {
            el: rootEl.current,
            previewStyle: 'vertical',
            initialValue: value,
            placeholder: placeholder || 'Please enter the',
            height: height || '600px',
            events: {
                change: (): void => {
                    const v: string = sEditor.getMarkdown();
                    onChange(v);
                }
            },
            plugins: [codeSyntaxHightlight],
            hooks: {
                addImageBlobHook: (fileOrBlob, callback) => {
                    const formdata = new FormData();
                    formdata.append('file', fileOrBlob);

                    request('/upload/images',{
                        method: 'POST',
                        data: formdata,
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }).then(res => {  
                        const { code, data } = res;
                        if (code === 0 ) {
                            const { url, title } = data;
                            callback(url, title);
                        } else {
                            const { msg } = res;
                            // eslint-disable-next-line no-console
                            console.log(msg);
                        }
                    }).catch(err => {                       
                        // eslint-disable-next-line no-console
                        console.log(err);
                    });
                
                }
            },
        }
        sEditor = new Editor(options);
        setEditor(sEditor);
    }

    const setValue = (v: string): void => {
        if (editor) {
            editor.setMarkdown(v);
        }
        onChange(v);
    }


    useImperativeHandle(ref,() =>({
        setValue,
    }))

    useEffect(() => {
        initEditor();

        return () => {
            if (editor) {
                editor.remove();
            }
        }
    },[1])



    return (
        <div ref={rootEl} />
    )

})


export default TuiEditor;