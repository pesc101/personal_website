import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const publications = [
  {
    title: "Efficient Fine-Tuning of Large Language Models for Domain-Specific NLP Tasks",
    authors: "Jan Strich, Maria Müller, Thomas Schmidt",
    venue: "ACL",
    year: "2024",
    abstract:
      "We present a novel parameter-efficient fine-tuning approach that reduces computational costs by 60% while maintaining state-of-the-art performance across multiple NLP benchmarks. Our method leverages low-rank adaptation techniques combined with selective layer freezing.",
    links: { pdf: "#", code: "#", demo: "#" },
  },
  {
    title: "Cross-Lingual Transfer Learning for Low-Resource Languages",
    authors: "Jan Strich, Aiko Tanaka, Priya Patel",
    venue: "EMNLP",
    year: "2023",
    abstract:
      "This work investigates cross-lingual transfer capabilities of multilingual transformers in low-resource settings. We propose a curriculum learning strategy that significantly improves downstream task performance for languages with fewer than 10,000 training examples.",
    links: { pdf: "#", code: "#", demo: null },
  },
  {
    title: "Towards Interpretable Neural Machine Translation with Attention Visualization",
    authors: "Jan Strich, Felix Weber",
    venue: "NAACL",
    year: "2023",
    abstract:
      "We introduce an interpretability framework for neural machine translation models that provides fine-grained attention visualizations and saliency maps. Our analysis reveals linguistic patterns learned by the model and identifies failure modes in out-of-distribution scenarios.",
    links: { pdf: "#", code: "#", demo: "#" },
  },
]

export default function Publications() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Selected publications. For a full list, see{" "}
        <a href="#" className="underline text-foreground">
          Google Scholar
        </a>
        .
      </p>
      {publications.map((pub) => (
        <Card key={pub.title}>
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-1">
              <Badge>{pub.venue}</Badge>
              <Badge variant="outline">{pub.year}</Badge>
            </div>
            <CardTitle className="text-base leading-snug">{pub.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{pub.authors}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{pub.abstract}</p>
            <div className="flex gap-2 flex-wrap">
              {pub.links.pdf && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pub.links.pdf}>PDF</a>
                </Button>
              )}
              {pub.links.code && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pub.links.code}>Code</a>
                </Button>
              )}
              {pub.links.demo && (
                <Button variant="outline" size="sm" asChild>
                  <a href={pub.links.demo}>Demo</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
