import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import About from "./components/about"
import Projects from "./components/projects"
import Publications from "./components/publications"
import Supervision from "./components/supervision"
import Outreach from "./components/outreach"
import CV from "./components/cv"
import KeyboardTyping from "./components/keyboard-typing"
import { User, FolderCode, BookOpen, GraduationCap, Megaphone, ScrollText } from "lucide-react"

export default function Home() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl">
            <KeyboardTyping />
            <Tabs defaultValue="about">
                <TabsList className="mb-6 w-full">
                    <TabsTrigger value="about" className="flex-1"><User />About</TabsTrigger>
                    <TabsTrigger value="projects" className="flex-1"><FolderCode />Projects</TabsTrigger>
                    <TabsTrigger value="publications" className="flex-1"><BookOpen />Publications</TabsTrigger>
                    <TabsTrigger value="supervision" className="flex-1"><GraduationCap />Supervision</TabsTrigger>
                    <TabsTrigger value="outreach" className="flex-1"><Megaphone />Outreach</TabsTrigger>
                    <TabsTrigger value="cv" className="flex-1"><ScrollText />CV</TabsTrigger>
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
