import { Header } from "@/components/header"
import { Landing } from "@/components/landing"
import { Projects } from "@/components/projects"
import { Notes } from "@/components/notes"
import { Experience } from "@/components/experience"
import { Tools } from "@/components/tools"
import { Contact } from "@/components/contact"
import { BootSequence } from "@/components/boot-sequence"

export default function Home() {
  return (
    <main className="min-h-screen">
      <BootSequence />
      <Header />
      <Landing />
      <Projects />
      <Notes />
      <Experience />
      <Tools />
      <Contact />
    </main>
  )
}
