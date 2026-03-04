import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Globe from "./globe"
import { fetchScholarStats } from "@/lib/google-scholar"
import { fetchGitHubStats } from "@/lib/github"
import { GraduationCap, Star, GitCommitHorizontal } from "lucide-react"

function HuggingFaceIcon({ size = 16 }: { size?: number }) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            aria-label="Hugging Face"
            width={size}
            height={size}
        >
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 1.5c5.799 0 10.5 4.701 10.5 10.5S17.799 22.5 12 22.5 1.5 17.799 1.5 12 6.201 1.5 12 1.5zm-3.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm-8.25 5.5c-.138 0-.25.112-.25.25 0 2.63 2.12 4.75 4.75 4.75s4.75-2.12 4.75-4.75c0-.138-.112-.25-.25-.25H7.25zm1.314 1h6.872C15.07 15.08 13.65 16 12 16c-1.65 0-3.07-.92-3.436-2z" />
        </svg>
    )
}

const GITHUB_USERNAME = "pesc101"
const SCHOLAR_USER_ID = "ZOV6IUEAAAAJ"
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_USER_ID}`

export default async function About() {
    const [ghResult, scholarResult] = await Promise.allSettled([
        fetchGitHubStats(GITHUB_USERNAME),
        fetchScholarStats(SCHOLAR_USER_ID),
    ])
    const { totalStars, totalContributions } = ghResult.status === "fulfilled"
        ? ghResult.value
        : { totalStars: 0, totalContributions: 0 }
    const scholar = scholarResult.status === "fulfilled" ? scholarResult.value : null

    const stats: { label: string; value: string | number; note: string; icon?: React.ReactNode }[] = [
        { label: "GitHub Stars", value: totalStars, note: "across public repos", icon: <Star size={16} /> },
        { label: "GitHub Contributions", value: totalContributions, note: "this year", icon: <GitCommitHorizontal size={16} /> },
        { label: "HuggingFace Downloads", value: "10K+", note: "placeholder", icon: <HuggingFaceIcon size={16} /> },
        {
            label: "Google Scholar Citations",
            value: scholar ? scholar.citations : "–",
            note: scholar ? `h-index: ${scholar.hIndex}` : "unavailable",
            icon: <GraduationCap size={16} />,
        },
        { label: "Paper Count", value: "8", note: "placeholder", icon: <GraduationCap size={16} /> },
    ]

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start justify-between">
                        <div className="flex flex-col gap-4 flex-1">
                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                <Avatar className="h-20 w-20">
                                    <AvatarFallback className="text-2xl font-bold bg-zinc-200 text-zinc-700">JS</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-2xl font-bold">Jan Strich</h2>
                                    <p className="text-muted-foreground">AI Researcher</p>
                                    <div className="flex gap-2 mt-2">
                                        <Badge variant="secondary">NLP</Badge>
                                        <Badge variant="secondary">Machine Learning</Badge>
                                        <Badge variant="secondary">Open Source</Badge>
                                    </div>
                                    <div className="flex gap-3 mt-3">
                                        <a
                                            href={SCHOLAR_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                            title="Google Scholar"
                                        >
                                            <GraduationCap size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <Separator />
                            <p className="text-muted-foreground leading-relaxed">
                                I am a researcher working on natural language processing and machine learning. My work focuses on making AI
                                systems more efficient and accessible. I am passionate about open-source research and sharing knowledge with
                                the community.
                            </p>
                        </div>
                        <div className="flex items-center justify-center shrink-0">
                            <Globe />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div>
                <h3 className="text-lg font-semibold mb-3">Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardHeader className="pb-1 pt-4 px-4">
                                <CardTitle className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                    {stat.icon}
                                    {stat.label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="px-4 pb-4">
                                <p className="text-2xl font-bold">{stat.value}</p>
                                <p className="text-xs text-muted-foreground mt-1">{stat.note}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
