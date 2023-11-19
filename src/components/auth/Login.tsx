import {Button, Checkbox, Form, Input, Typography} from "antd";
import {signIn} from "next-auth/react";
import {useState} from "react";

const {Title} = Typography
export default function Login({setMode, closeModal }: {setMode: (mode: 'login' | 'register') => void, closeModal?:()=>void}){
    const [form] = Form.useForm()
    const [error, setError] = useState<string | null>(null)

    const handleLogIn = async (values: any) => {
        const userCredentials = await form.validateFields()
        const signInDate = await signIn('credentials', {
            redirect: false,
            username: userCredentials.username,
            password: userCredentials.password
        })
        if (signInDate?.error) {
            setError("Invalid login or password")
        }else{
            closeModal && closeModal()
        }

        console.log(signInDate)

    }

    return(
        <Form form={form} onFinish={handleLogIn}>
            <Title level={3}>Log in</Title>
            {error && <p className="text-red-700">{error}</p>}
            <Form.Item   name="username" rules={[{ required: true }]}>
                <Input className='rounded-full' placeholder="username or email..." />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true }]}>
                <Input.Password className='rounded-full' placeholder='password...' />
            </Form.Item>

            <Form.Item label="remember me" name="remember" valuePropName="checked">
                <Checkbox />
            </Form.Item>
            <Form.Item>
                <Button className="w-full btn rounded-full" type="primary" htmlType="submit">Log in</Button>
                <label className="label">
                    <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
            </Form.Item>
            <p>Don't have an account? <button onClick={()=>setMode('register')}>Register</button></p>
        </Form>
    )
}