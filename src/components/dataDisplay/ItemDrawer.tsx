import {Button, Drawer, Space} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import React, {useRef} from "react";

export default function ItemDrawer({open, content, closeDrawer}:{open:boolean, content:any, closeDrawer:()=>void}) {
    return (

        <Drawer
            title={<div className='w-full flex justify-end gap-5'>
                <button onClick={closeDrawer}>
                    <CloseOutlined />
            </button>

        </div>}
            placement={'left'}
            className='h-5/6'
            onClose={closeDrawer}
            open={open}
            closeIcon={false}
            keyboard
            mask={false}
            zIndex={10}
            maskClosable={false}
            size={'large'}
            contentWrapperStyle={{ marginTop: '70px', height: 'calc(100% - 70px)', overflow: 'auto', borderRadius: '0 15px 0 0'}}
        >

            {content}
        </Drawer>
    )
}