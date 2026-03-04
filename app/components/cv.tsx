import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function CV() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">View or download Jan Strich&apos;s CV.</p>
        <Button asChild>
          <a href="/cv.pdf" download="Jan_Strich_CV.pdf">
            Download CV
          </a>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Curriculum Vitae</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full h-[800px] rounded-b-lg overflow-hidden">
            <iframe
              src="/cv.pdf"
              className="w-full h-full border-0"
              title="Jan Strich CV"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
