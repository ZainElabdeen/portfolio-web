"use client";

import { createResume } from "@/actions/resume.action";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateResumeButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCreate = async () => {
        setLoading(true);
        try {
            const result = await createResume({
                title: "My New Resume",
                content: {},
                layout: "modern"
            });
            
            if (result.success && result.data) {
                router.push(`/dashboard/resumes/${result.data.id}`);
            } else {
                console.error(result.error);
                toast("Failed to create resume");
            }
        } catch (error) {
             console.error(error);
             toast("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button onClick={handleCreate} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Create New
        </Button>
    )
}
