import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import About from "./components/about"
import Projects from "./components/projects"
import Publications from "./components/publications"
import Supervision from "./components/supervision"
import Outreach from "./components/outreach"
import CV from "./components/cv"

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Jan Strich</h1>
        <p className="text-muted-foreground">AI Researcher</p>
      </header>
      <Tabs defaultValue="about">
        <TabsList className="mb-6">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="publications">Publications</TabsTrigger>
          <TabsTrigger value="supervision">Supervision</TabsTrigger>
          <TabsTrigger value="outreach">Outreach</TabsTrigger>
          <TabsTrigger value="cv">CV</TabsTrigger>
        </TabsList>
        <TabsContent value="about"><About /></TabsContent>
        <TabsContent value="projects"><Projects /></TabsContent>
        <TabsContent value="publications"><Publications /></TabsContent>
        <TabsContent value="supervision"><Supervision /></TabsContent>
        <TabsContent value="outreach"><Outreach /></TabsContent>
        <TabsContent value="cv"><CV /></TabsContent>
      </Tabs>
    </main>
  )
}
