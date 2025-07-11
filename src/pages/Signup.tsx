import { useRef } from "react";
import { Button } from "../component/Button";
import { Input } from "./Input";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    function goToSignIn() {
        navigate("/signin")

    }

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            toast.warning("Please enter both username and password.");
            return;
        }
        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
            });

            toast.success("You have signed up!");
            navigate("/signin");
        } catch (err) {
            console.error(err);
            toast.error("Signup failed!");
        }
    }

    return (
        <div className="h-screen w-screen bg-orange-400 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-6">

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Welcome to
                    <div className="flex justify-center items-center">
                        <img src="logosignup.png" alt="linkify" style={{ width: "140px", height: "70px" }} />
                    </div>
                </h2>
                <p className="text-sm text-gray-500 text-center mb-2">Create your free account</p>


                <Input ref={usernameRef} placeholder="Username" />
                <Input ref={passwordRef} placeholder="Password" />
                <div className="flex justify-center pt-2">
                    <Button
                        onClick={signup}
                        loading={false}
                        variant="primary"
                        text="Sign Up"
                        fullWidth={true}
                    />
                </div>

                <p className="text-sm text-gray-600 mt-4 text-center">
                    Already have an account?{" "}
                    <span
                        onClick={goToSignIn}
                        className="text-orange-100 font-semibold cursor-pointer hover:underline">
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    );
}
