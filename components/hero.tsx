"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Github, Mail, Linkedin, ArrowRight, MapPin } from "lucide-react"

export function Hero() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-24 md:py-32 lg:py-40">
      <div className="flex flex-col gap-12">
        {/* Avatar - Now at the top */}
        <div 
          className="flex justify-start opacity-0 animate-fade-up" 
          style={{ animationFillMode: 'forwards' }}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-foreground/5 to-foreground/10 blur-xl" />
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-border/50 bg-muted">
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground/20 select-none">
                AC
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-8 md:max-w-2xl">
          <div className="flex flex-col gap-4 opacity-0 animate-fade-up animation-delay-100" style={{ animationFillMode: 'forwards' }}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>San Francisco, CA</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400">Available for work</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Frontend Developer
            </h1>
          </div>

          <p 
            className="text-lg text-muted-foreground leading-relaxed text-pretty opacity-0 animate-fade-up animation-delay-200" 
            style={{ animationFillMode: 'forwards' }}
          >
            I build accessible, pixel-perfect user interfaces that blend thoughtful design 
            with robust engineering. Focused on creating experiences that are fast, 
            beautiful, and built to last.
          </p>

          {/* Contact Links */}
          <div 
            className="flex flex-wrap items-center gap-6 opacity-0 animate-fade-up animation-delay-300" 
            style={{ animationFillMode: 'forwards' }}
          >
            <Link
              href="mailto:alex@example.com"
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              alex@example.com
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              GitHub
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
              LinkedIn
            </Link>
          </div>

          {/* CTA Buttons */}
          <div 
            className="flex flex-wrap gap-4 pt-2 opacity-0 animate-fade-up animation-delay-400" 
            style={{ animationFillMode: 'forwards' }}
          >
            <Button asChild size="lg" className="group">
              <Link href="#projects" className="gap-2">
                View Projects
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <Github className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
