import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../pages/config";

interface Content {
    title: string;
    link?: string;
    description?: string; // ✅ Add this
    type: string;
    _id?: string;
    fileName?: string;    // ✅ Add this
    fileSize?: number;    // ✅ Add this
    filePath?: string;    // ✅ Add this
    hasFile?: boolean;    // ✅ Add this
    downloadUrl?: string; // ✅ Add this
    createdAt?: string;   // ✅ Add this
    updatedAt?: string;   // ✅ Add this
}

export function useContent(refetchTrigger?: boolean) {
    const [contents, setContents] = useState<Content[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                // 🔍 DEBUG - Check what backend is sending
                console.log('🔍 Backend Response:', response.data.contents);
                console.log('🔍 First item:', response.data.contents[0]);

                setContents(response.data.contents || []);
                setError(null);
            } catch (err: any) {
                console.error("Error fetching content:", err);
                setError(err.response?.data?.message || "Failed to load content");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [refetchTrigger]);

    return { contents, loading, error };
}
