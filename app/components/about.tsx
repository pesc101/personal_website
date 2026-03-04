import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

async function getGitHubStats() {
  try {
    const res = await fetch("https://api.github.com/users/janstrich/repos", {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return { stars: 0 }
    const repos: unknown = await res.json()
    if (!Array.isArray(repos)) return { stars: 0 }
    const stars = repos.reduce((acc: number, repo: { stargazers_count: number }) => acc + (repo.stargazers_count ?? 0), 0)
    return { stars }
  } catch {
    return { stars: 0 }
  }
}

export default async function About() {
  const { stars } = await getGitHubStats()

  const stats = [
    { label: "GitHub Stars", value: stars, note: "from GitHub API" },
    { label: "GitHub Contributions", value: "500+", note: "placeholder" },
    { label: "HuggingFace Downloads", value: "10K+", note: "placeholder" },
    { label: "Google Scholar Citations", value: "120+", note: "placeholder" },
    { label: "Paper Count", value: "8", note: "placeholder" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
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
            </div>
          </div>
          <Separator className="my-4" />
          <p className="text-muted-foreground leading-relaxed">
            I am a researcher working on natural language processing and machine learning. My work focuses on making AI
            systems more efficient and accessible. I am passionate about open-source research and sharing knowledge with
            the community.
          </p>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold mb-3">Stats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs text-muted-foreground font-medium">{stat.label}</CardTitle>
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
