'use client';
import React, {createContext, ReactNode} from 'react';
import {message} from 'antd';


type ToastContextType = {
    success: (message: string) => void;
    error: (message: string, duration?: number) => void;
    warning: (message: string) => void;
};


export let ToastContext = createContext<ToastContextType | null>(null);
export default function ToastProvider({ children }: { children: ReactNode }){
  const [messageApi, contextHolder] = message.useMessage();
    //show only one message at a time
  const currentToast = React.useRef(null);

    const success = (message:string) => {
        if (currentToast.current) {
            return;
        }
       // @ts-ignore
        currentToast.current = messageApi.open({
            type: 'success',
            content: message || 'success',
            onClose: () => {
               currentToast.current = null;
           }
        });
    };

    const error = (message:string, duration:number = 5) => {
        if (currentToast.current) {
            return;
        }
        // @ts-ignore
        currentToast.current = messageApi.open({
            type: 'error',
            duration: duration,
            content: message,
            onClose: () => {
                currentToast.current = null;
            }
        });



    };

    const warning = (message:string) => {
        if (currentToast.current) {
            return;
        }
        // @ts-ignore
        currentToast.current =  messageApi.open({
            type: 'warning',
            content: message,
            onClose: () => {
                currentToast.current = null;
            }
        });
    };


    let value:{
        success:(message:string)=>void,
        error:(message:string, duration?:number)=>void,
        warning:(message:string)=>void

    } = {
        success,
        error,
        warning
    }

    // @ts-ignore
    return <ToastContext.Provider value={value}>{contextHolder}{children}</ToastContext.Provider>


}