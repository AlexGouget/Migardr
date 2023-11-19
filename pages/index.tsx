import dynamic from "next/dynamic";
import NavBar from "@/components/navigation/NavBar";
import {useState} from "react";

const MapComponent = dynamic(
    () => import('@/components/mapComponent'),
    { ssr: false }
);


function Index() {

    const [feature, setFeature] = useState<any>(null)



    return ( <main className="flex min-h-screen flex-col items-center justify-between">
                 <NavBar setFeature={setFeature} />
                 <MapComponent feature={feature} />
             </main>)
}

export default Index