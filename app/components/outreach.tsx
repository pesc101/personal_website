import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const outreachEntries = [
  {
    title: "Workshop on NLP for Social Good",
    description:
      "Organized a half-day workshop at ACL 2024 bringing together researchers working on applying NLP to social good problems, including healthcare, education, and climate change.",
    type: "Workshop",
    date: "ACL 2024",
    role: "Organizer",
    link: "#",
  },
  {
    title: "Guest Lecture: Modern NLP",
    description:
      "Delivered a guest lecture at the Technical University Munich on modern NLP techniques, covering transformer architectures, pre-training strategies, and practical applications.",
    type: "Lecture",
    date: "Technical University Munich",
    role: "Speaker",
    link: "#",
  },
]

const badgeVariant: Record<string, "default" | "secondary" | "outline"> = {
  Workshop: "default",
  Lecture: "secondary",
}

export default function Outreach() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Outreach activities including workshops, talks, and guest lectures. Replace with your own entries.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {outreachEntries.map((entry) => (
          <Card key={entry.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{entry.title}</CardTitle>
                <Badge variant={badgeVariant[entry.type] ?? "outline"}>{entry.type}</Badge>
              </div>
              <div className="flex gap-2 flex-wrap mt-1">
                <Badge variant="outline">{entry.date}</Badge>
                <Badge variant="outline">{entry.role}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground">{entry.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                <a href={entry.link} target="_blank" rel="noopener noreferrer">
                  Learn More
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
