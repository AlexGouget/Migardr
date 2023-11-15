// MapComponent.js
import React from 'react';
import {Circle, MapContainer, Marker, Pane, Popup, TileLayer, ZoomControl} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent() {
    return (
        <div className='w-full h-full z-0 absolute'>
            <MapContainer center={[51.505, -0.09]} zoomControl={false}  zoom={5} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[51.505, -0.09]}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
                <ZoomControl position="bottomright" />
            </MapContainer>
        </div>

);
}
