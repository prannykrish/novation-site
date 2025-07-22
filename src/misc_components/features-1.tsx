import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Scale, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function Features() {
    return (
        <section className=" py-16  dark:bg-transparent pt-24 pb-12 md:py-20 lg:py-32">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">Built to cover your needs.</h2>
                    <p className="mt-4">Empower your brand with clarity and confidence using our AI-driven trademark solutions.</p>
                </div>
                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Instant Risk Assessment</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Know how legally safe your name is—instantly, using advanced trademark analysis.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Scale className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">Multi-Name Comparison</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Test as many name ideas as you want. Compare risks across all of them in seconds.</p>
                        </CardContent>
                    </Card>

                    <Card className="group shadow-zinc-950/5">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium">AI-Powered Suggestions</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">Get alternative names and safer directions, powered by advanced real-time analysis.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div className="relative mx-auto size-36 duration-200 
        [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] 
        group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)35%,transparent)]
        group-hover:bg-zinc-950/5
        dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] 
        dark:group-hover:bg-white/5 
        dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div aria-hidden className="bg-radial to-card absolute inset-0 from-transparent to-75%" />
        <div className="bg-card absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">{children}</div>
    </div>
)