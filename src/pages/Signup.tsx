import { useRef } from "react";
import { Button } from "../component/Button";
import { Input } from "./Input";
import { BACKEND_URL } from "./config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    async function signup() {
        const username = usernameRef.current?.value;
        const password = passwordRef.current?.value;

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/api/v1/signup`, {
                username,
                password,
            });

            alert("You have signed up!");
            navigate("/signin");
        } catch (err) {
            console.error(err);
            alert("Signup failed!");
        }
    }

    return (
        <div className="h-screen w-screen bg-orange-600 flex justify-center items-center">
            <div className="bg-white rounded-xl border min-w-48 p-6">
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
            </div>
        </div>
    );
}
