import { CrossIcon } from "../icons/CrossIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { BACKEND_URL } from "../pages/config";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

const geist = {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
} as React.CSSProperties;

const TYPES = [
    { value: "linkedin", label: "LinkedIn", icon: <LinkedinIcon /> },
    { value: "twitter", label: "Twitter", icon: <XIcon /> },
    { value: "instagram", label: "Instagram", icon: <InstagramIcon /> },
    { value: "youtube", label: "YouTube", icon: <YoutubeIcon /> },
    { value: "documents", label: "Documents", icon: <DocumentIcon /> },
    { value: "other", label: "Other", icon: <OtherIcon /> },
];

const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface CreateComponentModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateComponentModal = ({ open, onClose, onSuccess }: CreateComponentModalProps) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [type, setType] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    const isSocial = !["documents", "other"].includes(type);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;

        if (selected.size > MAX_FILE_SIZE) {
            toast.error("File too large (max 10MB)");
            return;
        }
        if (!ALLOWED_TYPES.includes(selected.type)) {
            toast.error("Invalid file type");
            return;
        }

        setFile(selected);
    };

    const submit = async () => {
        const title = titleRef.current?.value?.trim();
        const link = linkRef.current?.value?.trim();
        const desc = descriptionRef.current?.value?.trim();

        if (!title || !type) {
            toast.warning("Title and type required");
            return;
        }
        if (type === "documents" && !file && !link) {
            toast.warning("Document needs a file or link");
            return;
        }
        if (type === "other" && !link && !desc) {
            toast.warning("Provide at least a link or description");
            return;
        }
        if (isSocial && (!link || !desc)) {
            toast.warning("Social media content needs both link and description");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("type", type);
            if (link) formData.append("link", link);
            if (desc) formData.append("description", desc);
            if (file) formData.append("file", file);

            const res = await fetch(`${BACKEND_URL}/api/v1/content`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || "Failed to create content");
            }

            toast.success("Content created!");

            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            if (descriptionRef.current) descriptionRef.current.value = "";
            if (fileRef.current) fileRef.current.value = "";
            setType("");
            setFile(null);

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={geist}>
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40" onClick={onClose} />

            <div className="fixed inset-0 flex items-start md:items-center justify-center z-50 p-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-md md:max-w-3xl lg:max-w-4xl mx-4 max-h-[90vh] overflow-auto text-gray-200">

                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b border-gray-800">
                        <h2 className="text-xl font-semibold text-white">Add Content</h2>
                        <button onClick={onClose} className="p-1">
                            <CrossIcon />
                        </button>
                    </div>

                    <div className="p-4 space-y-4">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-400">Title *</label>
                            <input
                                ref={titleRef}
                                placeholder="Enter title"
                                className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                            />
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-400">Type *</label>
                            <div className="grid grid-cols-2 gap-2">
                                {TYPES.map(({ value, label, icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setType(value)}
                                        className={`flex items-center gap-2 p-2 border rounded text-sm transition-colors ${type === value
                                            ? "border-green-500 bg-green-500/10"
                                            : "border-gray-800 bg-gray-950 hover:border-gray-700"
                                            }`}
                                    >
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {type && (
                            <>
                                {/* Link */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-400">
                                        Link {isSocial ? "*" : "(Optional)"}
                                    </label>
                                    <input
                                        ref={linkRef}
                                        placeholder={
                                            type === "documents" ? "External document link (optional)" :
                                                type === "other" ? "URL (optional if description provided)" :
                                                    "Enter URL"
                                        }
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-950 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-400">
                                        Description {isSocial ? "*" : "(Optional)"}
                                    </label>
                                    <textarea
                                        ref={descriptionRef}
                                        placeholder={
                                            type === "documents" ? "Brief description (optional)" :
                                                type === "other" ? "Description (optional if link provided)" :
                                                    "Enter description"
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-700 bg-gray-950 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 resize-none"
                                    />
                                </div>

                                {/* File upload — documents only */}
                                {type === "documents" && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-400">
                                            File (Optional)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-700 bg-gray-950 rounded-lg p-4 text-center">
                                            <input
                                                ref={fileRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx,.ppt,.pptx"
                                                onChange={handleFile}
                                                className="hidden"
                                                id="file"
                                            />
                                            <label htmlFor="file" className="cursor-pointer">
                                                {file ? (
                                                    <div className="text-green-500">
                                                        <div className="text-xl">✅</div>
                                                        <p className="text-sm font-medium">{file.name}</p>
                                                        <p className="text-xs text-gray-500">{(file.size / 1048576).toFixed(1)} MB</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">
                                                        <div className="text-xl">📎</div>
                                                        <p className="text-sm">Click to upload</p>
                                                        <p className="text-xs">PDF, DOC, PPT — max 10MB</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Hint */}
                                <p className="text-xs text-gray-400 px-1">
                                    {type === "documents" && "Upload a file or provide a link. Description is optional."}
                                    {type === "other" && "Either a link or description is required."}
                                    {isSocial && "Both link and description are required."}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <button
                            onClick={submit}
                            disabled={loading}
                            className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? "Creating..." : "Create Content"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CreateComponentModal;