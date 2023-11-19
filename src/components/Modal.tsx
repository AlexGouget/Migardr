import {useEffect, useRef} from "react";

export default function Modal({showModal, content, handleClose}:{showModal:boolean, content?:any, handleClose?:()=>void}){
    const refModal = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if(showModal){
            openModal()
        }else{
            closeModal()
        }
    }, [showModal])

    const openModal = () => {
        refModal.current?.showModal()
    }

    const closeModal = () => {
        refModal.current?.close()
    }

    return(
        <dialog ref={refModal} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button onClick={handleClose} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                <div className="modal-body">
                    {content}
                </div>
                <div className="modal-action">
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    )
}