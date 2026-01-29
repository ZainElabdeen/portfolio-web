"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { deleteResume } from "@/actions/resume.action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ResumeCardActions({ resumeId }: { resumeId: string }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if(!confirm("Are you sure you want to delete this resume?")) return;
        
        setLoading(true);
        await deleteResume(resumeId);
        setLoading(false);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem 
                    className="text-red-600 focus:text-red-600" 
                    onClick={handleDelete}
                    disabled={loading}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
