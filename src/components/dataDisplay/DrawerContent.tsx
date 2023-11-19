import {useSession} from "next-auth/react";
import {BsBookmarkCheck, BsThreeDotsVertical} from "react-icons/bs";
import {VscKebabVertical} from "react-icons/vsc";
import {CiBookmark} from "react-icons/ci";
import {Descriptions, Divider, Typography} from "antd";
import {useState} from "react";


const {Title} = Typography
export default function DrawerContent({data}:{data:any}) {
    const {data: session} = useSession()
    const [showMenu, setShowMenu] = useState(false)

    return (<div>
                <div
                    onMouseEnter={()=>{setShowMenu(true)}}
                    onMouseLeave={()=>{setShowMenu(false)}}
                    className='h-1/6 w-full flex justify-start gap-5'>
                    <h1 className="">{data.title}</h1>
                     <button><CiBookmark size={20} /></button>
                    {showMenu && <button><BsThreeDotsVertical size={20} /></button>}
                </div>
                <div>
                    <Typography.Paragraph>
                                {data.description}
                    </Typography.Paragraph>

                    <Descriptions title="Details :">
                        <Descriptions.Item label="Item year">{data.year  || 'unknow'} {data.year && data.bc ? '(BC)': '(AC)'}</Descriptions.Item>
                        <Descriptions.Item label="Year discovery">{data.yearDiscovery}</Descriptions.Item>
                    </Descriptions>


                    <Title level={5}>Description :</Title>
                    <Typography.Paragraph>
                                {data.content}
                    </Typography.Paragraph>
                    <div className='flex justify-end'>
                        <a href={`/discovery/${data.typepoint.libelle}/${data.slug}`}>Read more </a>
                    </div>

                    <Divider />

                </div>
            </div>);
}