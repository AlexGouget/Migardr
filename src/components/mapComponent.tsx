import React, {useEffect} from 'react';
import {Circle, MapContainer, Marker, Pane, Popup, TileLayer, useMap, ZoomControl} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import usePoint from "@/hook/usePoint";

const MapInteraction = ({ feature }:{feature :any}) => {
    const map = useMap();

    useEffect(() => {
        if (feature) {
            console.log('coordonnatre', [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]);
            map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 10);
        }
    }, [feature, map]);

    return null; // Ce composant ne rend rien visuellement
};


export default function MapComponent({feature}:{feature:any}) {
    const {point, error, isLoading} = usePoint()

    const createMarker = (point: any) => {
        const svgIcon = L.icon({
            iconUrl: `/assets/svg/${point.typepoint.icon}`,
            iconSize: [38, 38],
            iconAnchor: [22, 38],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94],
        })


        return (
            <Marker icon={svgIcon} position={[point.latitude, point.longitude]}>
                <Popup>
                    {point.title}  - {point.year} ({point.bc?"BC":'AC'})
                </Popup>
            </Marker>
        )
    }

    const generateMarker = () => {
        if(!point) return
        return point.map((point: any) => {
            return createMarker(point)
        })
    }

    return (
        <div className='w-full h-full z-0 absolute'>
            <MapContainer  center={[51.505, -0.09]} zoomControl={false}  zoom={5} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     {generateMarker()}
                <ZoomControl position="bottomright" />
                <MapInteraction feature={feature} />
            </MapContainer>
        </div>

);
}
