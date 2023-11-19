import {Button, Form, Input, Result, Typography} from "antd";
import {useState} from "react";


const {Title} = Typography
export default function Register({setMode}: {setMode: (mode: 'login' | 'register') => void}) {
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [form] = Form.useForm()


    const handleError = (errors: { message: string, errorType: string }[]) => {
        for (let error of errors) {
            const {message, errorType} = error
            switch (errorType) {
                case 'email':
                    //set fields email error
                    form.setFields([{name: 'email', errors: [message]}])
                    break;
                case 'username':
                    form.setFields([{name: 'name', errors: [message]}])
                    break;
            }
        }
    }


    const handleRegister = async () => {
        setLoading(true)
        const values = await form.validateFields().then(values => values).catch(err => console.log(err))
        const register = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        }).then(async res => {
            const response = await res.json()
            if (!res.ok) {
                handleError(response.errors || [])
                setSuccess(false)
            }else{
                setSuccess(true)
            }
            setLoading(false)
            return response
        }).catch(err => {
            console.log("error", err)
            setError(err)
            setLoading(false)
        })
    }


        const passwordRules = [
            {required: true, message: 'Please input your password'},
            {min: 6, message: 'Password must be at least 6 characters'}
        ]


    const formLayout = () =>{
        return (
            <Form form={form} onFinish={handleRegister}>
                <Title level={3}>Register</Title>
                {error && <p>{error}</p>}
                <Form.Item name='email' rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}>
                    <Input className={"rounded-full"} placeholder="email"/>
                </Form.Item>

                <Form.Item name='name' rules={[
                    {
                        required: true,
                        message: 'Please input your username!',
                    },
                ]}>
                    <Input className={"rounded-full"} placeholder="username"/>
                </Form.Item>
                <Form.Item name='password' rules={passwordRules}>
                    <Input.Password className={"rounded-full"} placeholder={"password"}/>
                </Form.Item>
                <Form.Item name='passwordConfirm' rules={[
                    {
                        required: true,
                        message: 'Please confirm your password!',
                    },
                    ({getFieldValue}) => ({
                        validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                ]}>
                    <Input.Password className={"rounded-full"} placeholder={'confirm password'}/>
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} className="btn rounded-full w-full" type="primary" htmlType="submit">Register</Button>
                </Form.Item>
                <p>Already have an account? <button onClick={()=>setMode('login')}>Login</button></p>
            </Form>
            )
    }

    const successLayout = () =>{
        return(
            <Result
                status="success"
                title="Account successfully created"
                subTitle="an email has been sent to your email address"
                extra={[
                    <Button onClick={()=>{setMode('login')}}>Log in</Button>,
                ]}
            />
        )
    }

        return(
            <div>
                {success ? successLayout() : formLayout()}
            </div>
        )



}