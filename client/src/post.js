import {format} from "date-fns";
import {Link} from "react-router-dom";

export default function Post({_id, title, summary, cover, content, createdAt, author}) {

    return (
        <div className="post">
        <div className="ArticleImg">
        <Link to={`/post/${_id}`}>
        <img src={'http://localhost:4000/'+cover} alt=""></img>
        </Link>

        </div>
        <div className="ArticleText">
        <Link to={`/post/${_id}`}>
        <h2>{title}</h2>
        </Link>
        <p className="info">
          <a className="author">Author: {author.username}</a>
          <time>Date: {format(new Date(createdAt), 'MMM d, yyyy HH:mm')}</time>
        </p>
        <p className="summary">{summary}</p>
        </div>
     </div>
    );
}