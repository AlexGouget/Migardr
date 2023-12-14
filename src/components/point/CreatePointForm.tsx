import React, {useContext, useState} from "react";
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
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {RcFile} from "antd/es/upload";

import {ToastContext} from "@/provider/toastProvider/ToastProvider";

const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });


export default function CreatePointForm({markerPosition , setMarkerPosition, closeDrawer}:{markerPosition:[number, number]|null, setMarkerPosition:(position:[number, number])=>void, closeDrawer:()=>void}) {

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const [form] = Form.useForm();
    const [yearMode, setYearMode] = React.useState<'precise'|'estimate'>('precise');

    const toast = useContext(ToastContext)



    const handleSubmit = async () => {
        const values = await form.validateFields();
        const formData = new FormData();

        Object.keys(values).forEach(key => {
            const value = values[key];
            if (value !== undefined) {
                if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Blob)) {
                    console.log('value',value)
                    formData.append(key, value);
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
            .then(response => {
                console.log('response',response)
                if(response.ok){
                    toast?.success("Discovery added")
                    form.resetFields();
                    setFileList([]);
                    //close drawer
                    closeDrawer()
                }
                return response.json()
            })
            .then(data => {
               if(data.error){
                   console.log(data)
                   toast?.error(data.error)
               }

            })
            .catch(error => {
                console.error('Error:', error)
                // @ts-ignore

            });
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

    console.log(category)


    useEffect(() => {
        if(markerPosition){
            form.setFieldsValue({
                lat: markerPosition[0],
                lng: markerPosition[1],
            });
        }
    }, [markerPosition]);

    const [newCategory, setNewCategory] = useState<boolean>(false)


    const formItemLayoutWithOutLabel = {
        wrapperCol: {
            xs: { span: 24, offset: 0 },
            sm: { span: 20, offset: 4 },
        },
    };

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
        },
    };

    return(<Form
        form={form}
        scrollToFirstError
        onValuesChange={(changedValues, allValues) => {
            console.log(allValues);
        }}
        layout="vertical"

        >
        <Divider orientation="left">Cordinate</Divider>
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
        <Divider orientation="left"> Category </Divider>
        <Form.Item
            name={'category'}
            rules={[{
                required: true,
                message: 'Please input category!'
            }]
            }
        >
                <Select
                    showSearch
                    //set the select field rounded
                    className="rounded-full"
                    placeholder="Select a category"
                    optionFilterProp="children"
                    onChange={(e)=>{
                        if(e === 25){
                            setNewCategory(true)
                        }else{
                            setNewCategory(false)
                        }
                    }}
                    options={category?.map((cat:any)=>({
                        value:cat.id,
                        label:cat.libelle
                    }))}
                />
        </Form.Item>

        <Form.Item
            hidden={!newCategory}
            name={"newCategory"}
            label={"Please enter new category :"}
            rules={[{
                // @ts-ignore
                required: newCategory,
                message: 'Please input category!'
            }]}

        >
            <Input placeholder="new category..." className='rounded-full' />
        </Form.Item>
        <Divider orientation="left"> Title </Divider>
                {/*TITLE*/}
               <Form.Item
                   rules={[{
                     required: true,
                     message: 'Please input title!'
               }]}

                   name="title">
                  <Input className='rounded-full' />
               </Form.Item>

                {/*DATE OF DISCOVERY*/}
                <Form.Item
                    label={"Year of discovery :"}
                    name="yearDiscovery"
                    rules={[{
                        required: true,
                        message: 'Please input year of discovery!'
                    }]}
                >
                    <DatePicker
                        disabledDate={(current) => {
                            return current && current > dayjs()
                        }}
                        placeholder='select the date of discovery'/>
                </Form.Item>


                   <Divider orientation="left">
                       <Tooltip
                           title={"date of item "}>Date of item
                       </Tooltip>
                   </Divider>
                 <Space className="flex align-middle flex-row items-center">
                     {/*SWITCH SELECT YEAR MODE*/}
                     {yearMode === 'precise' ?
                     <Form.Item
                         name="year"
                        rules={[{
                                required: true,
                                message: 'Please input year!'
                            }]}

                     >
                         <DatePicker
                             disabledDate={(current) => {
                                 return current && current > dayjs()
                             }}
                             placeholder='Select the date of item'/>
                     </Form.Item>
                     :
                     <div className='flex align-middle gap-4'>
                         <Form.Item
                                    name="ApproximateYearBefore"
                                    rules={[{
                                        required: true,
                                        message: 'Please input year!'
                                    },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('ApproximateYearAfter') > value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('The year must be less than the year after!'));
                                            },
                                        }),
                                    ]}
                         >
                             <DatePicker
                                 disabledDate={(current) => {
                                     return current && current > dayjs()
                                 }}
                                 picker="year"
                                 placeholder='Between...'/>

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


                     <Form.Item>
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
                     </Form.Item>

               </Space>
                {/*DESCRIPTION*/}
                <Divider orientation="left">
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

                <Divider orientation="left">
                    <Tooltip
                        title={"Source of discovery "}>Source(s)
                    </Tooltip>
                </Divider>

                {/*SOURCE*/}
        <Form.List
            name="sources"
        >
            {(fields, { add, remove }, { errors }) => (
                <>
                    {fields.map((field, index) => (
                        <Form.Item
                            {...formItemLayout}
                            required={false}
                            key={field.key}
                        >
                            <Form.Item
                                {...field}
                                validateTrigger={['onChange', 'onBlur']}
                                noStyle
                                rules={[
                                    {

                                        type: 'url',
                                        message: "Please input source's name or delete this field.",
                                    },
                                    //url can only be https
                                    {
                                        validator(_, value) {
                                            if (value && !value.startsWith('https')) {
                                                return Promise.reject(new Error('The url must be https!'));
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                ]}
                            >
                                <Input  placeholder="source" style={{ width: '90%' }} />
                            </Form.Item>
                            {fields.length > 1 ? (
                                <MinusCircleOutlined
                                    className="dynamic-delete-button ml-2"
                                    onClick={() => remove(field.name)}
                                />
                            ) : null}
                        </Form.Item>
                    ))}
                    <Form.Item>
                        <Button
                            type="dashed"
                            onClick={() => add()}
                            style={{ width: '80%' }}
                            icon={<PlusOutlined />}
                        >
                            Add source
                        </Button>
                        <Form.ErrorList errors={errors} />
                    </Form.Item>
                </>
            )}
        </Form.List>


                <Divider>
                    <Tooltip
                        title={"date of item "}>Images
                    </Tooltip>
                </Divider>
                <Form.Item>
                    <p>Max image size : 5mb</p>
                    <Upload
                        //accept only jpeg and png
                        accept='.jpg,.png'
                        beforeUpload={(file) => {

                            console.log("size",file.size)
                          //check file size
                            if(file.size > 5000000){
                                toast?.error("File size is too big")
                                return false
                            }
                        }}
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