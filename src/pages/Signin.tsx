import { useRef } from "react";
import { Button } from "../component/Button"
import { Input } from "./Input"
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Signin() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const donthaveacc = () => {
        navigate("/signup");
    };

    async function signin() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            toast.warning("Please enter both username and password.");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password,
            });

            const jwt = response.data.token
            localStorage.setItem("token", jwt)
            toast.success("Signin successful");
            navigate("/main");
        } catch (err) {
            console.error(err);
            toast.error("Signin failed!");
        }
    }

    return <div className="h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-800 to-indigo-800 flex justify-center items-center">

        <div className="bg-white rounded-xl border min-w-48 p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Welcome Back </h2>

            <div className="flex justify-center items-center">
                <img src="BrainCacheSign.png" alt="linkify" style={{ width: "140px", height: "130px" }} />
            </div>

            <p className="text-sm text-gray-500 text-center mb-2">Sign in to your account to continue</p>

            <Input ref={usernameRef} placeholder="Username" />
            <Input ref={passwordRef} placeholder="Password" type="password" />

            <div className=" flex justify-center pt-2">
                <Button onClick={signin} loading={false} variant="primary" text="Sign In" fullWidth={true} />
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account? <span onClick={donthaveacc} className="text-orange-100 font-semibold cursor-pointer hover:underline">Sign Up </span>
            </p>
        </div>
    </div>
}