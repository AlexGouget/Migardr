import {Form} from "antd";
import {useEffect} from "react";

export default function CreatePointForm({markerPosition}:{markerPosition:[number, number]|null}){

    const [form] = Form.useForm();

    // useEffect(() => {
    //     console.log(markerPosition)
    // }, [markerPosition]);


    return(<div>
        <p>position: {JSON.stringify(markerPosition)}</p>
    </div>)
}