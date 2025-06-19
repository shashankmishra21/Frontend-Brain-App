import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../pages/config";


interface Content {
    title: string;
    link: string;
    type: string;
    _id?: string;
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
