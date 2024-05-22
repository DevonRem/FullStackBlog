import { useState } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    async function register(ev) {
        ev.preventDefault();
        const response = await fetch('https://full-stack-blog-flax.vercel.app/register', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type':'application/json'},
        });
        if (response.status === 200) {
            alert('Registration successful!');

        }
        else{
            alert('Registration failed, please try again');
        }
    }

    return (
        <>
        
        <form className="register" onSubmit={register}>
            <h1>Register</h1>
            <input type="text" 
            placeholder="Username" 
            value={username} 
            onChange={ev => setUsername(ev.target.value)}></input>
            <input type="password" 
            placeholder="Password"
            value={password}
            onChange={ev => setPassword(ev.target.value)}></input>
            <button>Register</button>
        </form>
        </>
    );
}