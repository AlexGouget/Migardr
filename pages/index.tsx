import dynamic from "next/dynamic";

const MapComponent = dynamic(
    () => import('@/components/mapComponent'),
    { ssr: false }
);


function Index() {
    return <MapComponent />
}

export default Index