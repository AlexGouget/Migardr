import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import Login from "@/components/auth/Login";
import Register from "@/components/auth/Register";
import Add from "@/components/ad/Add";

export default function LoginModalContent({closeModal}:{closeModal:()=>void}){
    const { data: session } = useSession()
    const [mode, setMode] = useState<'login' | 'register'>('login')

    if(session) return null

    return (
        <div className='flex flex-col gap-2'>
            {mode === 'login' && <div>
                <Login setMode={setMode} closeModal={closeModal}/>

            </div>}
            {mode === 'register' && <div>
                <Register setMode={setMode}/>
            </div>}
            <Add style='w-full h-28 bg-red-700'/>
        </div>
    )

}