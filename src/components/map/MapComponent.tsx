import React, {useEffect} from 'react';
import {Circle, MapContainer, Marker, Pane, Popup, TileLayer, useMap, ZoomControl} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import usePoint from "@/hook/usePoint";
import DrawerPointContent from "@/components/dataDisplay/DrawerPointContent";

const MapInteraction = ({ feature }: { feature: any }) => {
    const map = useMap();
    useEffect(() => {
        if (feature) {
            map.setView([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 10);
        }
    }, [feature, map ]);

    return null;
};

const CreateNewMarker = ({newMarker, retrieveMarker}: { newMarker: boolean, retrieveMarker: (position: any) => void }) => {
    const map = useMap();
    const [newMarkerPosition, setNewMarkerPosition] = React.useState<any>(null)
    const initialPosition = map.getCenter();
    initialPosition.lng += 12;

    useEffect(() => {
        retrieveMarker([initialPosition.lat, initialPosition.lng])
    }, [newMarker]);

    // setNewMarkerPosition(initialPosition)
    const newMarkerSvg = L.icon({
        iconUrl: `/assets/svg/newMarker.svg`,
        iconSize: [70, 70],
        iconAnchor: [22, 38],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
        className: 'text-red-500'
    })

    if(!newMarker) return null

    return (
        <Marker
            icon={newMarkerSvg}
            draggable={true}
            eventHandlers={{
                dragend: (e) => {
                    const newPosition = [e.target.getLatLng().lat, e.target.getLatLng().lng];
                    setNewMarkerPosition(() => newPosition); // Mettre à jour la position du marqueur
                    retrieveMarker(newPosition)
                },
            }}
            position={newMarkerPosition ? newMarkerPosition : initialPosition}
        >
        </Marker>
    )
}



export default function MapComponent({feature, openDrawer, newMarker, retrieveMarker}:{feature:any, openDrawer:(content:any)=>void , newMarker:boolean, retrieveMarker:(position:any)=>void}) {
    const {point, error, isLoading} = usePoint()

    const CreateMarker = ({point}: { point: any }) => {
        const map = useMap();
        const svgIcon = L.icon({
            iconUrl: `/assets/svg/${point.typepoint.icon}`,
            iconSize: [38, 38],
            iconAnchor: [22, 38],
            popupAnchor: [-3, -76],
            shadowSize: [68, 95],
            shadowAnchor: [22, 94],
        })




        return (
            <Marker
                icon={svgIcon}
                position={[point.latitude, point.longitude]}
                eventHandlers={{
                    click: () => {
                        map.setView([point.latitude, point.longitude-6]);
                        openDrawer(<DrawerPointContent id={point.id} />)

                    },
                    //open popup when marker is hover
                    mouseover: (e) => {
                        e.target.openPopup();
                    },
                    //close popup when marker is not hover
                    mouseout: (e) => {
                        e.target.closePopup();
                    },
                }}
            >
                <Popup>
                    {point.title} - {point.year} ({point.bc ? "BC" : "AC"})
                </Popup>
            </Marker>
        );
    };






    const generateMarker = () => {
        if (!point) return null;
        return point.map((p: { id: React.Key | null | undefined; }) => <CreateMarker key={p.id} point={p} />);
    };

    return (
        <div className='w-full h-full z-0 absolute'>
            <MapContainer center={[51.505, -0.09]} zoomControl={false}  zoom={5} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                     {generateMarker()}
                <ZoomControl position="bottomright" />
                <MapInteraction feature={feature}  />
                <CreateNewMarker newMarker={newMarker} retrieveMarker={retrieveMarker} />

            </MapContainer>
        </div>

);
}