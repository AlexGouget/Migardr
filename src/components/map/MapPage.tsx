'use client';
import NavBar from "@/components/navigation/NavBar";
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import ItemDrawer from "@/components/dataDisplay/ItemDrawer";
import CreatePointForm from "@/components/point/CreatePointForm";
import ToastProvider from "@/provider/toastProvider/ToastProvider";


//dynamic import
const MapComponent = dynamic(
    () => import('@/components/map/MapComponent'),
    { ssr: false }
);

export default function MapPage() {
    const [feature, setFeature] = useState<any>(null)
    const [showDrawer, setShowDrawer] = useState(false)
    const [drawerContent, setDrawerContent] = useState<any>(null)
    const [newMarkerPosition, setNewMarkerPosition] = useState<[number, number] | null>(null)
    const [newMarker, setNewMarker] = useState<any>(false)
    const [id, setId] = useState<number | null>(null)
    const [title, setTitle] = useState<string | null>(null)




    const openDrawer = (content:any, title:string) => {
        setTitle(title)
        setNewMarker(false)
        setDrawerContent(content)
        setShowDrawer(true)
    }
    const closeDrawer = () => {
        setShowDrawer(false)
        setNewMarker(false)
    }

    const createPoint = () => {
        setTitle("New discovery")
        setShowDrawer(true)
        setNewMarker(true)
    }

    useEffect(() => {
        console.log("mapPage",newMarkerPosition)
    }, [newMarkerPosition]);

    const retrieveNewMarkerPosition = (position:any) => {
        console.log(position)
        setNewMarkerPosition(position)
    }

    console.log("mapPage",newMarkerPosition)

    return (
        <ToastProvider>
            <NavBar setFeature={setFeature} createPoint={createPoint} />
            <ItemDrawer
                title={title}
                open={showDrawer}
                content={
                newMarker
                    ?


                         <CreatePointForm markerPosition={newMarkerPosition} setMarkerPosition={setNewMarkerPosition} closeDrawer={closeDrawer} />

                    : drawerContent
            } closeDrawer={closeDrawer} />
            <MapComponent
                feature={feature}
                openDrawer={openDrawer}
                newMarker={newMarker}
                newMarkerPosition={newMarkerPosition}
                retrieveMarker={retrieveNewMarkerPosition}

            />
        </ToastProvider>
    )
}


