import { Eye, Move, Fingerprint, Pencil, Settings2, Sparkles, Zap, Triangle, ShieldCheck, Lightbulb, TrendingUp } from 'lucide-react'

export default function Features() {
    return (
        <section className="py-12 md:py-20">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-balance text-4xl font-medium lg:text-5xl">Help That Makes Sense.</h2>
                    <p>Novation helps you name ideas with confidence and clarity -<br/> backed by clear guidance, not guesswork. 
                    </p>
                </div>

                <div className="relative mx-auto grid max-w-4xl divide-x divide-y border *:p-12 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Eye className="size-4" />
                            <h3 className="text-sm font-bold">Clarity</h3>
                        </div>
                        <p className="text-sm">Instantly see how risky your name might be - no legal knowledge needed. </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Move className="size-4" />
                            <h3 className="text-sm font-bold">Flexibility</h3>
                        </div>
                        <p className="text-sm">Test as many ideas as you want. Feel free to explore.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Triangle className="size-4" />

                            <h3 className="text-sm font-bold">Simplicity</h3>
                        </div>
                        <p className="text-sm">Complex legal data, decoded. No jargon. No guessing. No confusion.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4" />

                            <h3 className="text-sm font-bold">Confidence</h3>
                        </div>
                        <p className="text-sm">Built with help from experts. You’re not just guessing - you’re informed.</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="size-4" />

                            <h3 className="text-sm font-bold">Inspiration</h3>
                        </div>
                        <p className="text-sm">Stuck on coming up with a name? Get tailored suggestions based on your needs. </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="size-4" />

                            <h3 className="text-sm font-bold">Momentum</h3>
                        </div>
                        <p className="text-sm">Novation grows with you - from a simple side project to a full blown business.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
