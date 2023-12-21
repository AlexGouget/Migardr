import React, {useContext, useEffect, useState} from "react";
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
import debounce from "lodash/debounce";
const { Option } = Select;
import dayjs from "dayjs";
import useSWR from "swr";
import {fetcher} from "@/components/utils/utils";
import {InboxOutlined, MinusCircleOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {RcFile, UploadChangeParam} from "antd/es/upload";

import {ToastContext} from "@/provider/toastProvider/ToastProvider";
import Dragger from "antd/es/upload/Dragger";
import {nanoid} from "nanoid";

import 'dayjs/locale/fr'; // Exemple pour la langue française
dayjs.locale('fr');

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
    const [uuid, setUuid] = useState<string|null>(null)
    const [uploadableFiles, setUploadableFiles] = useState<boolean>(false)
    const [canSubmit, setCanSubmit] = useState<boolean>(false)
    const toast = useContext(ToastContext)
    const [send, setSend] = useState<boolean>(false)

    type mood = 'photography' | 'webDev' | '3Dprint' | 'Maker'


    console.log('form', form.getFieldsValue())
    console.log('uploadableFiles', uploadableFiles)
    console.log('form title', form.getFieldValue('title') !== undefined)


    useEffect(() => {
        const localForm = localStorage.getItem('form')
        if(localForm){
            //check if form is not empty
            const formValues = JSON.parse(localForm)
            if(formValues.lat && formValues.lng){
                setMarkerPosition([formValues.lat, formValues.lng])
            }
            if(formValues.yearAfter){
                setYearMode('estimate')
            }

            //convert date to dayjs
            if(formValues.yearDiscovery){
                formValues.yearDiscovery = dayjs(formValues.yearDiscovery)
            }
            if(formValues.ApproximateYearBefore){
                formValues.ApproximateYearBefore = dayjs(formValues.ApproximateYearBefore)
            }
            if(formValues.ApproximateYearAfter){
                formValues.ApproximateYearAfter = dayjs(formValues.ApproximateYearAfter)
            }
            form.setFieldsValue(formValues);
            setUuid(formValues.uuid)

        }else{
            const uuid = nanoid(10)
            localStorage.setItem('form', JSON.stringify({
                ...form.getFieldsValue(),
                lat: markerPosition ? markerPosition[0] : null,
                lng: markerPosition ? markerPosition[1] : null,
                uuid: uuid
            }));
            form.setFieldsValue({
                ...form.getFieldsValue(),
                lat: markerPosition ? markerPosition[0] : null,
                lng: markerPosition ? markerPosition[1] : null,
                uuid: uuid
            });
            setUuid(uuid)
        }
    }, []);



    /**
     * Retrieve Uploaded files from localstorage uuid
     */
    const {data:files ,error:errorFiles, isLoading:loadingFile, } = useSWR(`/api/image-uploaded?uuid=${uuid}`, fetcher)

    console.log(`/api/image-uploaded?uuid=${uuid}`, files)

    useEffect(() => {
        if(files && files.length > 0){
            const fileList:UploadFile[] = []
            files.map((file:any)=>{
                fileList.push({
                    uid: file.id,
                    name: file.name,
                    url: file.url,
                })
            })
            setFileList(fileList)
        }
    }, [files]);

    useEffect(() => {
        if(markerPosition){
           localStorage.setItem('form', JSON.stringify({
                ...form.getFieldsValue(),
                lat: markerPosition ? markerPosition[0] : null,
                lng: markerPosition ? markerPosition[1] : null,
              }));
           }
    }, [markerPosition]);



    const handleSubmit = async () => {

        setSend(true)
        const values = await form.validateFields();

        console.log('Received values of form: ', values);

        fetch('/api/new-discovery', {
            method: 'POST',
            body: JSON.stringify(values),
        })
            .then(response => {
                console.log('response',response)
                if(response.ok){
                    toast?.success("Discovery added")
                    form.resetFields();
                    setFileList([]);
                    //close drawer
                    closeDrawer()
                    setSend(false)
                    localStorage.removeItem('form')
                }
                return response.json()
            })
            .then(data => {
               if(data.error){
                   console.log(data)
                   toast?.error(data.error)
                     setSend(false)
               }

            })
            .catch(error => {
                console.error('Error:', error)
                toast?.error("Error")
                setSend(false)
                // @ts-ignore

            });
    };






    const handleCancel = () => setPreviewOpen(false);



    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const beforeUpload = (file:any) => {
        if (file.size > 5000000) {
            toast?.error("File size is too big");
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    // @ts-ignore
    // const handleChange = ({ fileList: newFileList }) => {
    //     // Filtrer les fichiers trop volumineux
    //     const filteredList = newFileList.filter((file: { size: number; }) => {
    //         // Ignorer les fichiers avec une taille supérieure à 5 Mo
    //         return file.size <= 5000000;
    //     });
    //
    //     setFileList(filteredList);
    // };


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



    const cat  = category?.map((cat:any)=>({
        value:cat.id,
        label:cat.libelle
    }))
    //we add option "Other" with value 1
    cat?.push({
        value:1,
        label:'Other'
    })


    const CustomDatePicker = () => {
        const currentYear = new Date().getFullYear();
        const startYear = -5000; // Exemple: commence 5000 ans avant J.-C.
        const endYear = currentYear;

        const [year, setYear] = useState(form.getFieldValue('year')||null);
        const [month, setMonth] = useState(form.getFieldValue('month')||null);
        const [day, setDay] = useState(form.getFieldValue('day')||null);

        const handleYearChange = (value:any) => {
            setYear(value);
            setMonth(null);
            setDay(null);
        };

        const handleMonthChange = (value:any) => {
            setMonth(value);
            setDay(null);
        };

        const handleDayChange = (value:any) => {
            setDay(value);
        };

        const getDaysInMonth = (year:any, month:any) => {
            return new Date(year, month, 0).getDate();
        };


        return (<>

        <Form.Item
            label={yearMode === 'precise' ? "Year of item :" : "Approximate year of item. Between..."}
        >
            <Space align='center'>
                <Form.Item
                    name="year"
                    rules={[
                        { required: true, message: 'Please select a year!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if(yearMode !== 'estimate') return Promise.resolve();
                                if (!value || getFieldValue('yearAfter') < value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The year must be less than the second date!'));
                            },
                        }),
                    ]}
                >
                    <Select
                        style={{ width: 100 }}
                        showSearch
                        allowClear
                        onClear={() => {
                            setYear(null);
                            setMonth(null);
                            setDay(null);
                        }}
                        placeholder="Year"
                        onChange={handleYearChange}
                        filterOption={(input, option) =>
                            // @ts-ignore
                            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map((year) => (
                            <Option key={year} value={year}>
                                {year > 0 ? `${year} AD` : `${Math.abs(year)} BC`}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item

                    name="month"
                >
                    <Select
                        style={{ width: 100 }}
                        allowClear placeholder="Month" onChange={handleMonthChange} disabled={form.getFieldValue('year') === undefined}>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                            <Option allowClear key={month} value={month}>{month}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item

                    name="day"
                    style={{ width: 100 }}
                >
                    <Select allowClear placeholder="Day" onChange={handleDayChange} disabled={form.getFieldValue('month') === undefined}>
                        {year && month && Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((day) => (
                            <Option key={day} value={day}>{day}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name={"dateMode"}
                >
                    <Checkbox
                        style={{width: 200}}
                        onChange={()=>{
                            if(yearMode === 'precise'){
                                setYearMode('estimate')
                            }else{
                                setYearMode('precise')
                            }}}
                        checked={yearMode === 'estimate'}
                    >
                        Unknow age of item
                    </Checkbox>

                </Form.Item>
            </Space>
        </Form.Item>
                {yearMode === 'estimate' &&
                    <Form.Item
                        label={"And..."}
                    >
                        <Space align='center'>

                            <Form.Item

                                name="yearAfter"
                                rules={[
                                    { required: true, message: 'Please select a year!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('year') > value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The year must be more than the first date!'));
                                        },
                                    }),
                                ]}
                            >
                                <Select
                                    style={{ width: 100 }}
                                    showSearch
                                    allowClear
                                    onClear={() => {
                                        setYear(null);
                                        setMonth(null);
                                        setDay(null);
                                    }}
                                    placeholder="Year"
                                    onChange={handleYearChange}
                                    filterOption={(input, option) =>
                                        // @ts-ignore
                                        option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i).map((year) => (
                                        <Option key={year} value={year}>
                                            {year > 0 ? `${year} AD` : `${Math.abs(year)} BC`}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item

                                name="monthAfter"
                            >
                                <Select
                                    style={{ width: 100 }}
                                    allowClear placeholder="Month" onChange={handleMonthChange} disabled={form.getFieldValue('year') === undefined}>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                        <Option allowClear key={month} value={month}>{month}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="dayAfter"
                                style={{ width: 100 }}
                            >
                                <Select allowClear placeholder="Day" onChange={handleDayChange} disabled={form.getFieldValue('month') === undefined}>
                                    {year && month && Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1).map((day) => (
                                        <Option key={day} value={day}>{day}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Space>
                    </Form.Item>
                }
            </>
        );
    };


    useEffect(() => {
        if(form.getFieldValue('title') === "" || form.getFieldValue('title') === undefined) {
            console.log('uploadableFiles title', false)
            setUploadableFiles(false)
        }else{
            console.log('uploadableFiles title', true)
            setUploadableFiles(true)
        }
    }, [form]);



    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as RcFile);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
        setFileList(newFileList);
    const a = 0;

    console.log("a",!a)


    return(<Form
        onChange={debounce(() => {
            //store form data in localstorage
            localStorage.setItem('form', JSON.stringify(form.getFieldsValue()));
        }, 1000)}
        form={form}
        scrollToFirstError
        onValuesChange={debounce(() => {
            if(form.getFieldValue('title') !== "" && form.getFieldValue('title') !== undefined) {
                console.log('uploadableFiles title', true)
                setUploadableFiles(true)
            }else{
                console.log('uploadableFiles title', false)
                setUploadableFiles(false)
            }
            localStorage.setItem('form', JSON.stringify(form.getFieldsValue()));
        }, 1000)}
        layout="vertical"

        >
        <Divider orientation="left">Coordinate</Divider>
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
                        if(e === 1){
                            setNewCategory(true)
                        }else{
                            setNewCategory(false)
                        }
                    }}
                    options={cat}
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
                  <Input
                      onChange={(e)=>{
                            if(e.target.value === ""){
                               form.setFieldValue('title', undefined)
                            }
                      }}
                      className='rounded-full' />
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
                           title={"date of item "}>Age of item
                       </Tooltip>
                   </Divider>
                    {CustomDatePicker()}
                 <Space className="flex align-middle flex-row items-center">
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
                {/*UPLOAD*/}
                <Form.Item name='files'>


                    {/*<Upload*/}
                    {/*    action={`/api/image-upload?uuid=${form.getFieldValue('uuid')}&title=${form.getFieldValue('title')}`}*/}
                    {/*    listType="picture-card"*/}
                    {/*    fileList={fileList}*/}
                    {/*    onPreview={handlePreview}*/}
                    {/*    onChange={handleChange}*/}
                    {/*>*/}
                    {/*    {fileList.length >= 8 ? null : uploadButton}*/}
                    {/*</Upload>*/}
                    {/*<Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>*/}
                    {/*    <img alt="example" style={{ width: '100%' }} src={previewImage} />*/}
                    {/*</Modal>*/}

                    <p>Max image size : 5mb</p>
                    <Upload
                        name={'file'}
                        disabled={!uploadableFiles}
                        //accept only jpeg and png
                        accept='.jpg,.png'
                        action={`/api/image-upload?uuid=${form.getFieldValue('uuid')}&title=${form.getFieldValue('title')}`}
                        beforeUpload={beforeUpload}
                        listType="picture-card"
                        fileList={fileList}
                        onChange={handleChange}
                        maxCount={5}
                        // onPreview={handlePreview}
                        // onChange={handleChange}
                        onRemove={(file)=>{
                            fetch(`/api/delete-uploaded-image?id=${file.uid}`, {
                                method: 'DELETE',
                            })
                                .then(response => {
                                    console.log('response',response)
                                    if(response.ok){
                                        toast?.success("File deleted")
                                        setFileList(fileList.filter((item) => item.uid !== file.uid));
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
                                    toast?.error("Error")
                                    // @ts-ignore

                                });
                        }}
                        multiple

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
                <Form.Item hidden name='uuid'>
                    <Input hidden  />
                </Form.Item>
           </Form>)
}


