import NavBar from "@/components/navigation/NavBar";
import React, {useState} from "react";
import dynamic from "next/dynamic";
import ItemDrawer from "@/components/dataDisplay/ItemDrawer";


//dynamic import
const MapComponent = dynamic(
    () => import('@/components/map/mapComponent'),
    { ssr: false }
);

export default function MapPage() {
    const [feature, setFeature] = useState<any>(null)
    const [showDrawer, setShowDrawer] = useState(false)
    const [id, setId] = useState<number | null>(null)



    const openDrawer = (id:number) => {
        setId(id)
        setShowDrawer(true)
    }
    const closeDrawer = () => {
        setShowDrawer(false)
    }

    return (
        <>

            <NavBar setFeature={setFeature} />
            <ItemDrawer id={id} open={showDrawer} closeDrawer={closeDrawer} />

            <MapComponent feature={feature} openDrawer={openDrawer}  />



        </>
    )
}