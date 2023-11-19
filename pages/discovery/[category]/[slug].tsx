import { PrismaClient } from '@prisma/client'
import { useRouter } from 'next/router'
import dynamic from "next/dynamic";
import Navbar from '@/components/navigation/NavBar';
export async function getServerSideProps({ params, res }: { params: { category:string, slug: string; }; res: any }) {
    //caching the resut
    res.setHeader(
        'Cache-Control',
        'public, s-maxage=10, stale-while-revalidate=59'
    )
    const prisma = new PrismaClient();

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
            <Navbar />
            <h1>{postObject.name}</h1>
            <p>{postObject.description}</p>
        </div>
    )
}