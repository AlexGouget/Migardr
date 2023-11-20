import {useState} from "react";
import {FaBookmark, FaRegBookmark} from "react-icons/fa";

export default function Bookmark({ callback, args }: { callback: () => void, args: any }) {
    const [hover, setHover] = useState(false)

    return (
        <button onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }}>
            {hover ? <FaBookmark {...args} /> : <FaRegBookmark {...args} />}
        </button>
    )
}