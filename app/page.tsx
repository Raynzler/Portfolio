import { Header } from "@/components/header"
import { Landing } from "@/components/landing"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Tools } from "@/components/tools"
import { Contact } from "@/components/contact"
import { BootSequence } from "@/components/boot-sequence"
import { CvSection } from "@/components/cv-section"
import { SystemAtmosphere } from "@/components/system-atmosphere"
import { LightcycleGrid } from "@/components/lightcycle-grid"

export default function Home() {
  return (
    <main className="min-h-screen pb-32">
      <SystemAtmosphere />
      <BootSequence />
      <LightcycleGrid />
      <Header />
      <Landing />
      <Projects />
      <Experience />
      <Tools />
      <CvSection />
      <Contact />
    </main>
  )
}
