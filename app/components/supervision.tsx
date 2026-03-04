import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const supervisions = [
  {
    studentName: "Student Name 1",
    thesisTitle: "Thesis Title Example",
    type: "Master's Thesis",
    year: "2024",
    status: "Completed",
  },
  {
    studentName: "Student Name 2",
    thesisTitle: "Another Thesis Title",
    type: "Bachelor's Thesis",
    year: "2024",
    status: "Ongoing",
  },
]

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  Completed: "default",
  Ongoing: "secondary",
}

export default function Supervision() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        This section lists supervised students and theses. I am happy to supervise motivated students on topics related
        to NLP and machine learning.
      </p>
      <div className="space-y-3">
        {supervisions.map((entry) => (
          <Card key={entry.studentName}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <CardTitle className="text-base">{entry.studentName}</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{entry.type}</Badge>
                  <Badge variant="outline">{entry.year}</Badge>
                  <Badge variant={statusVariant[entry.status] ?? "outline"}>{entry.status}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">&ldquo;{entry.thesisTitle}&rdquo;</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
