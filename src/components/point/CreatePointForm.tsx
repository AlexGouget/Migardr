import React, {useState} from "react";
import {
    Button,
    Checkbox,
    DatePicker,
    Divider,
    Form,
    Input,
    InputNumber, Modal,
    Select,
    Space,
    Switch,
    Tooltip,
    Upload,
    UploadFile, UploadProps
} from "antd";
import {useEffect} from "react";
import debounce from "lodash/debounce";

import dayjs from "dayjs";
import useSWR from "swr";
import {fetcher} from "@/components/utils/utils";
import {PlusOutlined} from "@ant-design/icons";
import {RcFile} from "antd/es/upload";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


export default function CreatePointForm({markerPosition , setMarkerPosition}:{markerPosition:[number, number]|null, setMarkerPosition:(position:[number, number])=>void}) {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])

    const [form] = Form.useForm();
    const [yearMode, setYearMode] = React.useState<'precise'|'estimate'>('precise');



    const handleSubmit = async () => {
        const values = await form.validateFields();
        console.log('Received values of form: ', values);
        const formData = new FormData();

        Object.keys(values).forEach(key => {
            const value = values[key];
            if (value !== undefined) {
                if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        });

        fileList.forEach(file => {
            if (file.originFileObj) {
                formData.append('files', file.originFileObj, file.originFileObj.name);
            }
        });

        fetch('/api/new-discovery', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.ok ? response.json() : Promise.reject(response))
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };



    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };


    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);

    //swr fetcher
    const {data:category ,error, isLoading, } = useSWR('/api/typepoint', fetcher)
    useEffect(() => {
        if(markerPosition){
            form.setFieldsValue({
                lat: markerPosition[0],
                lng: markerPosition[1],
            });
        }
    }, [markerPosition]);

    return(<Form
        form={form}

        onChange={()=>{
            console.log(form.getFieldsValue())
        }}
        layout="vertical">
        <div className="flex justify-center gap-4">
            {/*LATTITUDE LONGITUDE*/}
            <Form.Item
                label="Lattitude :"
                name="lat"
                className="w-1/2"
                initialValue={markerPosition ? markerPosition[0] : null}
                >
                <InputNumber onChange={(e)=>{
                    const newPos:[number,number] = [Number(e), markerPosition ? markerPosition[1] : 0]
                    console.log(newPos)
                    setMarkerPosition(newPos)
                }} precision={12} className="w-full rounded-full"/>
            </Form.Item>
            <Form.Item
                label="Longitude :"
                name="lng"
                className="w-1/2"
                initialValue={markerPosition ? markerPosition[1] : null}
                >
                <InputNumber
                onChange={(e)=>{
                    const newPos:[number,number] = [markerPosition ? markerPosition[0] : 0, Number(e)]
                    console.log(newPos)
                    setMarkerPosition(newPos)
                }}
                    precision={12} className="w-full rounded-full"/>
            </Form.Item>
        </div>
        <Form.Item label={"Category"}>
                <Select
                    showSearch
                    //set the select field rounded
                    className="rounded-full"


                    placeholder="Select a category"
                    optionFilterProp="children"
                    options={category?.map((cat:any)=>({
                        value:cat.id,
                        label:cat.libelle
                    }))}
                />
        </Form.Item>
                {/*TITLE*/}
               <Form.Item
                   rules={[{
                     required: true,
                     message: 'Please input title!'
               }]}
                   label="Title :"
                   name="title">
                  <Input className='rounded-full' />
               </Form.Item>

                {/*DATE OF DISCOVERY*/}
                <Form.Item label={"year of discovery"} name="yearDiscovery">
                    <DatePicker
                        disabledDate={(current) => {
                            return current && current > dayjs()
                        }}
                        placeholder='select the date of discovery'/>
                </Form.Item>
                   <Divider>
                       <Tooltip
                           title={"date of item "}>Date of item
                       </Tooltip>
                   </Divider>
                 <Space className="flex align-middle flex-col">
                     {/*SWITCH SELECT YEAR MODE*/}
                     {yearMode === 'precise' ?
                     <Form.Item name="year">
                         <DatePicker
                             disabledDate={(current) => {
                                 return current && current > dayjs()
                             }}
                             placeholder='select the date of item'/>
                     </Form.Item>
                     :
                     <div className='flex align-middle gap-4'>
                         <Form.Item
                                    name="ApproximateYearBefore"
                         >
                             <DatePicker
                                 picker="year"
                                 placeholder='between...'/>

                         </Form.Item>
                         <Form.Item
                                    name="ApproximateYearAfter">
                             <DatePicker
                                 picker="year"
                                 disabledDate={(current) => {
                                     return current && current > dayjs()
                                 }}
                                 placeholder='and'/>
                         </Form.Item>
                     </div>
                     }

                         <Checkbox  onChange={()=>{
                             if(yearMode === 'precise'){
                                 setYearMode('estimate')
                             }else{
                                 setYearMode('precise')
                             }}}
                            checked={yearMode === 'estimate'}
                         >
                             Unknow date of item
                         </Checkbox>



               </Space>
                {/*DESCRIPTION*/}
                <Divider>
                    <Tooltip
                        title={"date of item "}>Description
                    </Tooltip>
                </Divider>
                <Form.Item
                    rules={[{
                    max: 190,
                    message: 'Description is too long (max 190 characters)'
                }]}
                    label="Description :"
                    name="description">
                    <Input.TextArea placeholder='small description...'  className='rounded-xl' />
                </Form.Item>
                <Form.Item
                    label="Content :"
                    name="content">
                    <Input.TextArea rows={10} placeholder="More detail..."  className='rounded-xl' />
                </Form.Item>
                <Form.Item
                    label="Source :"
                    name="url">
                    <Input placeholder="Source..."  className='rounded-xl' />
                </Form.Item>

                <Divider>
                    <Tooltip
                        title={"date of item "}>Images
                    </Tooltip>
                </Divider>
                <Form.Item>
                    <Upload

                        listType="picture-card"
                        fileList={fileList}
                        maxCount={5}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {fileList.length >= 8 ? null : uploadButton}
                    </Upload>
                    <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                        <img alt="example" style={{ width: '100%' }} src={previewImage} />
                    </Modal>
                </Form.Item>

                {/*CSRF*/}
                <Form.Item name="csrf">
                    <input type="hidden" name="csrf" value="csrf" />
                </Form.Item>

                {/*//submit button*/}
                <Form.Item>
                    <button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
                        Submit
                    </button>

                </Form.Item>
           </Form>)
}