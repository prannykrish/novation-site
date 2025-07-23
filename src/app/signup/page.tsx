import  SignUpForm  from "@/misc_components/signup-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="absolute top-4 left-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}