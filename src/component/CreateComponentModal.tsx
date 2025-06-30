import { CrossIcon } from "../icons/CrossIcon";
import { BACKEND_URL } from "../pages/config";
import { Button } from "./Button";
import { useRef, useState } from "react";
import axios from "axios";
import { Input } from "../pages/Input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const typeOptions = ["linkedin", "twitter", "instagram", "youtube"];

interface CreateComponentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateComponentModal = ({ open, onClose, onSuccess }: CreateComponentModalProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const [selectedType, setSelectedType] = useState<string>("");

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        if (!title || !link || !selectedType) {
            toast.warning("Please fill in Title, Link, and select a Type.");
            return;
        }

        try {
            await axios.post(`${BACKEND_URL}/api/v1/content`, {
                title,
                link,
                type: selectedType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            toast.success("Content created successfully!");
            onSuccess();
            onClose();

        } catch (err: any) {
            console.error(err);
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div>
            {open && (
                <div>
                    <div className="w-full h-full bg-gray-100 fixed top-0 left-0 opacity-60"></div>

                    <div className="w-full h-full fixed top-0 left-0 flex justify-center items-center">
                        <div className="bg-white opacity-100 p-6 rounded-xl shadow-lg min-w-[300px]">
                            <div className="flex justify-end">
                                <div onClick={onClose} className="cursor-pointer">
                                    <CrossIcon />
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">Add your Links</h2>

                            <div className="mb-4">
                                <Input ref={titleRef} placeholder={"Title"} />
                                <Input ref={linkRef} placeholder={"Link"} />

                                <div className="mt-4">
                                    <p className="text-sm font-semibold mb-2">Select Type:</p>
                                    <div className="flex flex-col gap-2">
                                        {typeOptions.map((type) => (
                                            <label key={type} className="flex items-center gap-2 text-sm cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="type"
                                                    value={type}
                                                    checked={selectedType === type}
                                                    onChange={(e) => setSelectedType(e.target.value)}
                                                />
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center mt-4">
                                <Button onClick={addContent} variant="primary" text="Submit" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
export default CreateComponentModal;
