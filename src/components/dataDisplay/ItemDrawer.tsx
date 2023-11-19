import {Button, Drawer, Space} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import useSWR from "swr";
import {fetcher} from "@/components/utils/utils";
import Spinner from "@/components/dataDisplay/spinner/Spinner";
import DrawerContent from "@/components/dataDisplay/DrawerContent";
import React, {useRef} from "react";
import {CiBookmark} from "react-icons/ci";
import {BsThreeDotsVertical} from "react-icons/bs";

export default function ItemDrawer({id,  open, closeDrawer}:{id:number | null, open:boolean, closeDrawer:()=>void}) {

    const {data:item ,error, isLoading, } = useSWR(id ? `/api/point/${id}` : null, fetcher)

    const drawerStyle = {
        height: `calc(100% - 70px)`, // Réduire la hauteur du Drawer de la hauteur de la navbar
        marginTop: '70px', // Décaler le Drawer vers le bas pour qu'il commence sous la navbar
    };


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
            style={drawerStyle}
        >

            {isLoading && !item ? <div className='h-full w-full flex justify-center align-middle'><Spinner/></div> : <DrawerContent data={item} />}
        </Drawer>
    )
}