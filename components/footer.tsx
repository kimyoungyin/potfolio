"use client"

import Link from "next/link"
import { Github, Mail, Linkedin, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-12">
          {/* CTA Section */}
          <div className="flex flex-col items-center gap-6 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {"Let's work together"}
            </h3>
            <p className="max-w-md text-muted-foreground">
              {"I'm currently looking for new opportunities. Whether you have a question or just want to say hi, feel free to reach out."}
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="mailto:alex@example.com" className="gap-2">
                <Mail className="h-4 w-4" />
                Get in Touch
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border/50" />

          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Alex Chen
            </p>

            {/* Links */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
                <Link
                  href="mailto:alex@example.com"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
                <Link
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="rounded-full ml-2">
                <Link
                  href="https://blog.example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-1.5"
                >
                  Blog
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
