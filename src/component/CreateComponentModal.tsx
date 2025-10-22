import { CrossIcon } from "../icons/CrossIcon";
import { DocumentIcon } from "../icons/DocumentIcon";
import { InstagramIcon } from "../icons/InstagramIcon";
import { LinkedinIcon } from "../icons/LinkedinIcon";
import { OtherIcon } from "../icons/OtherIcon";
import { XIcon } from "../icons/XIcon";
import { YoutubeIcon } from "../icons/YoutubeIcon";
import { BACKEND_URL } from "../pages/config";
import { Button } from "./Button";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

// Move constants outside component
const TYPES = [
    { value: "linkedin", label: "LinkedIn", icon: <LinkedinIcon/> },
    { value: "twitter", label: "Twitter", icon: <XIcon/> },
    { value: "instagram", label: "Instagram", icon: <InstagramIcon/> },
    { value: "youtube", label: "YouTube", icon: <YoutubeIcon/> },
    { value: "documents", label: "Documents", icon: <DocumentIcon/> },
    { value: "other", label: "Other", icon: <OtherIcon/> }
];

const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
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

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        
        if (selectedFile.size > MAX_FILE_SIZE) {
            toast.error("File too large (max 10MB)");
            return;
        }
        
        if (!ALLOWED_TYPES.includes(selectedFile.type)) {
            toast.error("Invalid file type");
            return;
        }
        
        setFile(selectedFile);
    };

    const submit = async () => {
        const title = titleRef.current?.value?.trim();
        const link = linkRef.current?.value?.trim();
        const desc = descriptionRef.current?.value?.trim();

        // 🔍 DEBUG: Log form values
        console.log('=== FRONTEND FORM VALUES ===');
        console.log('Title:', title);
        console.log('Link:', link);
        console.log('Description:', desc);
        console.log('Description length:', desc?.length || 0);
        console.log('Type:', type);
        console.log('File:', file?.name || 'None');
        
        // Check if description ref is working
        console.log('Description ref value:', descriptionRef.current?.value);
        console.log('Description ref exists:', !!descriptionRef.current);

        if (!title || !type) {
            toast.warning("Title and type required");
            return;
        }

        if (type === 'documents' && !file && !link) {
            toast.warning("Document needs file or link");
            return;
        }

        if (type === 'other' && !link && !desc) {
            toast.warning("Other needs link or description");
            return;
        }

        if (!['documents', 'other'].includes(type) && (!link || !desc)) {
            toast.warning("Social media needs link and description");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('type', type);
            
            if (link) {
                formData.append('link', link);
                console.log('✅ Added link to FormData:', link);
            }
            
            if (desc) {
                formData.append('description', desc);
                console.log('✅ Added description to FormData:', desc);
            } else {
                console.log('❌ No description to add - desc is:', desc);
            }
            
            if (file) {
                formData.append('file', file);
                console.log('✅ Added file to FormData:', file.name);
            }

            // 🔍 DEBUG: Log FormData contents
            console.log('=== FORMDATA CONTENTS ===');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch(`${BACKEND_URL}/api/v1/content`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create content');
            }

            const result = await response.json();
            console.log('=== BACKEND RESPONSE ===');
            console.log('Result:', result);

            toast.success("Content created!");
            
            // Reset form
            if (titleRef.current) titleRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            if (descriptionRef.current) descriptionRef.current.value = "";
            if (fileRef.current) fileRef.current.value = "";
            setType("");
            setFile(null);
            
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Frontend submit error:', err);
            toast.error(err.message || "Failed to create content");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h2 className="text-xl font-semibold">Add Content</h2>
                        <button onClick={onClose} className="p-1">
                            <CrossIcon />
                        </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                Title *
                            </label>
                            <input
                                ref={titleRef}
                                placeholder="Enter title"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                Type *
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {TYPES.map(({ value, label, icon }) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setType(value)}
                                        className={`flex items-center gap-2 p-2 border rounded text-sm transition-colors ${
                                            type === value ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    >
                                        <span>{icon}</span>
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Conditional Fields - Always show when type is selected */}
                        {type && (
                            <>
                                {/* Link Field */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Link {!['documents', 'other'].includes(type) ? '*' : '(Optional)'}
                                    </label>
                                    <input
                                        ref={linkRef}
                                        placeholder={
                                            type === 'documents' ? "External document link (optional)" :
                                            type === 'other' ? "Enter URL (optional if description provided)" :
                                            "Enter URL"
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Description Field - ALWAYS SHOW */}
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-gray-700">
                                        Description {!['documents', 'other'].includes(type) ? '*' : '(Optional)'}
                                    </label>
                                    <textarea
                                        ref={descriptionRef}
                                        placeholder={
                                            type === 'documents' ? "Brief description of document (optional)" :
                                            type === 'other' ? "Enter description (optional if link provided)" :
                                            "Enter description for your content"
                                        }
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        onChange={(e) => {
                                            // 🔍 DEBUG: Log description changes
                                            console.log('Description changed:', e.target.value);
                                        }}
                                    />
                                </div>

                                {/* File Upload for Documents */}
                                {type === 'documents' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            File (Optional)
                                        </label>
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
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
                                                    <div className="text-green-600">
                                                        <div className="text-xl">✅</div>
                                                        <p className="text-sm font-medium">{file.name}</p>
                                                        <p className="text-xs">{(file.size / 1048576).toFixed(1)} MB</p>
                                                    </div>
                                                ) : (
                                                    <div className="text-gray-500">
                                                        <div className="text-xl">📎</div>
                                                        <p className="text-sm">Click to upload document</p>
                                                        <p className="text-xs">PDF, DOC, PPT (max 10MB)</p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Help Text */}
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <p className="text-xs text-blue-700">
                                        {type === 'documents' && 
                                            "💡 Upload a file OR provide a link. Description is optional."
                                        }
                                        {type === 'other' && 
                                            "💡 Provide either a link OR description (or both)."
                                        }
                                        {!['documents', 'other'].includes(type) && 
                                            "💡 Both link and description are required for social media content."
                                        }
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="p-4 border-t">
                        <Button 
                            onClick={submit}
                            variant="primary"
                            text={loading ? "Creating..." : "Create Content"}
                            disabled={loading}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateComponentModal;
