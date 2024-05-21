import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {format} from "date-fns";

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(() => {

        fetch(`http://localhost:4000/post/${id}`).then(response => {
            response.json().then(postInfo=> {
                setPostInfo(postInfo);
            });
        });
    }, [])

    if(!postInfo) return '';
    return(
        <div className="post-page">
            <div className="image">
                <img src={`http://localhost:4000/${postInfo.cover}`} alt=""/>
            </div>
            <h1>{postInfo.title}</h1>
            <time>Post Date: {format(new Date(postInfo.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">Author: {postInfo.author.username}</div>
            <div dangerouslySetInnerHTML={{__html:postInfo.content}} />
        </div>
    );
}