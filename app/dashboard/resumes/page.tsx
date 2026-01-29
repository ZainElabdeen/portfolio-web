import { getResumes, createResume } from "@/actions/resume.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Download, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import CreateResumeButton from "@/components/resume/create-resume-button"; // We'll make this component
import ResumeCardActions from "@/components/resume/resume-card-actions"; // Client component for actions

export default async function ResumesPage() {
    const resumes = await getResumes();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Resumes</h2>
                    <p className="text-muted-foreground">Manage your CVs and tailored resumes.</p>
                </div>
                <CreateResumeButton />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {resumes.map((resume: any) => (
                    <Card key={resume.id} className="flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span className="truncate">{resume.title}</span>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardTitle>
                            <CardDescription>
                                Updated {format(new Date(resume.updatedAt), "PPP")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="text-sm text-muted-foreground">
                             Layout: <span className="font-medium text-foreground">{resume.layout}</span>
                           </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                           <Link href={`/dashboard/resumes/${resume.id}`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" /> Edit
                                </Button>
                           </Link>
                           <ResumeCardActions resumeId={resume.id} />
                        </CardFooter>
                    </Card>
                ))}
            </div>
             {resumes.length === 0 && (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No resumes created</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Create your first resume to get started.
                    </p>
                    <CreateResumeButton />
                </div>
            )}
        </div>
    )
}
