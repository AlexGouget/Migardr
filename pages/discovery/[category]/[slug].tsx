import prisma from "../../../prisma/db";
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import Navbar from '@/components/navigation/NavBar';
import {PointService} from "../../api/point/point.service";
export async function getServerSideProps({ params, res, req }:{params:any, res:any, req:any}) {

    // const pointService = new PointService(req, res)

    //caching the resut
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )
    //if params category and slug are not defined, send 404
    if (!params.slug && !params.category) return {notFound: true}
    const post = await prisma.point.findUnique({
        // where: { slug: params.slug }
        where: {
            slug: params.slug,
            typepoint: {
                is: {
                    libelle: params.category
                }
            }
        }
    });
    if (!post) return {notFound: true}
    const postStringified = JSON.stringify(post);
    return { props: { post: postStringified } };
}


export default function Page({ post }:{post:any}){
    const postObject = JSON.parse(post);
    return (
        <div>
            <Navbar createPoint={()=>{}}  setFeature={()=>{}}/>
            <h1>{postObject.name}</h1>
            <p>{postObject.description}</p>
        </div>
    )
}