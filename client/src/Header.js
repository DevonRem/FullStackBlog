import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom";
import { UserContext } from "./UserContext";

export default function Header() {
  const {setUserInfo, userInfo} = useContext(UserContext);
  useEffect(() => {
    fetch('https://full-stack-blog-flax.vercel.app/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
  }, [])

  function logout() {
    fetch('https://full-stack-blog-flax.vercel.app/logout', {
      credentials: 'include',
      method: 'POST',
    });
    setUserInfo(null);
  }

  const username = userInfo?.username;

    return (
        <header>
        <Link to="/" className="logo">Dev's Blog</Link>
        <nav>
          {username && (
            <>
            <span>Welcome, {username}!</span>
            <Link to="/create">Create new post</Link>
            <a onClick={logout}>logout</a>
            </>
          )}
          {!username && (
            <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </>
          )}

        </nav>
      </header>
    );
}