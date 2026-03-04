import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const projects = [
  {
    title: "awesome-llm-apps",
    description:
      "A curated list of awesome LLM applications, tools, and resources. A collection of state-of-the-art projects using large language models.",
    type: "GitHub",
    link: "https://github.com/janstrich/awesome-llm-apps",
    stars: "2.1k",
  },
  {
    title: "transformers",
    description:
      "Contributions to the HuggingFace Transformers library. State-of-the-art machine learning models for NLP, vision, and audio tasks.",
    type: "HuggingFace",
    link: "https://huggingface.co/janstrich/transformers",
    stars: "120k",
  },
  {
    title: "bert-base-uncased",
    description:
      "Fine-tuned BERT model for various NLP downstream tasks. Pre-trained on a large corpus with masked language modeling objective.",
    type: "HuggingFace",
    link: "https://huggingface.co/janstrich/bert-base-uncased",
    stars: "5k",
  },
]

const badgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  GitHub: "default",
  HuggingFace: "secondary",
}

export default function Projects() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        A selection of open-source projects and model releases. Replace with your own projects.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <Badge variant={badgeVariant[project.type] ?? "outline"}>{project.type}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  View Project
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
