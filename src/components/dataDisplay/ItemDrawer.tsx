import {Button, Drawer, Space , Typography} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import React, {useRef, useState} from "react";
import Bookmark from "@/components/utils/Bookmark";
import {BsThreeDotsVertical} from "react-icons/bs";

const {Title} = Typography

export default function ItemDrawer({open, content, closeDrawer, title}:{open:boolean, content:any, closeDrawer:any, title:string|null}) {


    return (
        <Drawer
            title={<div className='w-full flex justify-between gap-5 align-top'>
                <Title level={3}>{title}</Title>

                <button className='h-2' onClick={closeDrawer}>
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