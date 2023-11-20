import React from "react";
import {useSession} from "next-auth/react";
import {BsBookmarkCheck, BsThreeDotsVertical} from "react-icons/bs";
import {VscKebabVertical} from "react-icons/vsc";
import {CiBookmark} from "react-icons/ci";
import {Descriptions, Divider, Image, Typography} from "antd";
import {useState} from "react";
import {FaBookmark, FaRegBookmark} from "react-icons/fa";
import Bookmark from "@/components/utils/Bookmark";
import useSWR from "swr";
import {fetcher} from "@/components/utils/utils";
import Spinner from "@/components/dataDisplay/spinner/Spinner";


const {Title} = Typography
export default function DrawerPointContent({id}:{id:number}) {
    const {data: session} = useSession()
    const [showMenu, setShowMenu] = useState(false)

    const {data:item ,error, isLoading, } = useSWR(id ? `/api/point/${id}` : null, fetcher)


    if(!item) return (<div className='h-full w-full flex justify-center align-middle'>No data</div>)

    if(isLoading) return (<div className='h-full w-full flex justify-center align-middle'><Spinner /></div>)


    return (<div>
        
                     {/*//cover image*/}
                    <div className='h-1/6  min-h-[200px] w-full'
                    style={{
                        backgroundImage: `url(${item.coverImage?.url || `/assets/image/defaultCover/${item.typepoint.libelle}.jpg`})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} >
                    </div>
                        {/*<div className='w-full flex justify-center'>*/}
                        {/*    <Image*/}
                        {/*        src={data.coverImage?.url || `/assets/image/defaultCover/${data.typepoint.libelle}.jpg`}*/}
                        {/*        width={300}*/}
                        {/*        alt={data.coverImage?.description}*/}
                        {/*        className={'rounded-lg'}*/}
                        {/*        placeholder={*/}
                        {/*            <Image*/}
                        {/*                preview={false}*/}
                        {/*                src={data.coverImage?.url}*/}
                        {/*                alt={data.coverImage?.description}*/}
                        {/*                width={200}*/}
                        {/*            />*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</div>*/}
                 <div
                    onMouseEnter={()=>{setShowMenu(true)}}
                    onMouseLeave={()=>{setShowMenu(false)}}
                    className='h-1/6 w-full flex justify-start gap-5'>
                    <h1 className="">{item.title}</h1>
                   <Bookmark callback={()=>{}} args={{size: 20}} />
                   {showMenu && <button><BsThreeDotsVertical size={20} /></button>}
                </div>
                <div>
                    <Typography.Paragraph>
                                {item.description}
                    </Typography.Paragraph>

                    <Descriptions title="Details :">
                        <Descriptions.Item label="Item year">{item.year  || 'unknow'} {item.year && item.bc ? '(BC)': '(AC)'}</Descriptions.Item>
                        <Descriptions.Item label="Year discovery">{item.yearDiscovery}</Descriptions.Item>
                    </Descriptions>


                    <Title level={5}>Description :</Title>
                    <Typography.Paragraph
                    ellipsis={{rows: 4 }}
                    >
                                {item.content}
                    </Typography.Paragraph>
                    <div className='flex justify-end'>
                        <a href={`/discovery/${item.typepoint.libelle}/${item.slug}`}>Read more </a>
                    </div>
                    <Divider />
                    <div className='flex justify-center gap-2 align-middle'>
                        {
                            item.urlimage?.map((url:any, index:number) => {
                                if(index < 2){
                                    return (
                                        <Image
                                            key={index}
                                            src={url.url}
                                            alt={url.description}
                                            width={200}
                                            className='rounded-xl'
                                            placeholder={
                                                <Image
                                                    preview={false}
                                                    src={url.url}
                                                    alt={url.description}
                                                    width={200}
                                                />
                                            }

                                        />
                                    )
                                }
                                if(index === 2){
                                    return (<a href="" className='flex justify-center items-center rounded-xl bg-gray-300 w-[200px]'>
                                            {item.urlimage.length - 2} more image
                                            </a>


                                        // <div key={index} className='flex justify-center items-center rounded-xl bg-gray-300 w-40 h-40'>
                                        //     <a href="">{data.urlimage.length - 2} more image </a>
                                        //     <p className='text-4xl'></p>
                                        // </div>
                                    )
                                }

                            })
                        }

                    </div>

                    <Divider />
                        {/*TODO user creator*/}

                    <div className='flex justify-start align-middle gap-2'>
                            <p>created by</p>
                        {/*{data.user.image ? <div className="avatar">*/}
                        {/*    <div className="w-16 rounded">*/}
                        {/*        <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" alt="Tailwind-CSS-Avatar-component" />*/}
                        {/*    </div>*/}
                        {/*</div>: <div className="avatar online placeholder">*/}
                        {/*    <div className="bg-neutral text-neutral-content rounded-full w-8">*/}
                        {/*        /!*select the 2 first letter of name*!/*/}
                        {/*        <span className="text-xl">{data.user.name.slice(0,2).toUpperCase()}</span>*/}
                        {/*    </div>*/}
                        {/*</div> }*/}
                        <a href={`/historian/${item.user.name}`}>{item.user.name}</a>
                    </div>
                </div>
            </div>);
}