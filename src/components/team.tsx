import Link from 'next/link'

const members = [
    {
        name: 'Pranav Krishnan',
        role: 'Co-Founder, CEO',
        avatar: '/images/Pranav2.jpeg',
        link: '#',
    },
    {
        name: 'Aditya Gollamudi',
        role: 'Co-Founder, CTO',
        avatar: '/images/Aditya.jpeg',
        link: '#',
    },
]

// Add this new array for advisors
const advisors = [
    {
        name: 'Nicole Smith',
        role: 'Customer relations',
        avatar: '/images/Pranav2.jpeg',
        link: '#',
    },
    {
        name: 'Michael Johnson',
        role: 'Funding advisor',
        avatar: '/images/Pranav2.jpeg',
        link: '#',
    },
]

export default function TeamSection() {
    return (
        <>
            <section className="py-10 md:py-10 dark:bg-transparent">
                <div className="mx-auto max-w-5xl border-t px-6">
                    <div className="mt-10 gap-4 sm:grid sm:grid-cols-2 md:mt-10">
                        <div className="sm:w-2/5">
                            <h2 className="text-3xl font-bold sm:text-4xl">Our Team</h2>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            <p></p>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-10">
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 place-items-center mx-auto max-w-3xl">
                            {members.map((member, index) => (
                                <div key={index} className="group overflow-hidden">
                                    <div className="flex justify-center">
                                        <img 
                                            className="w-120 h-120 rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                                            src={member.avatar} 
                                            alt="team member" 
                                            width="826" 
                                            height="1239" 
                                        />
                                    </div>
                                    <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                        <div className="flex justify-between">
                                            <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{member.name}</h3>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{member.role}</span>
                                            <Link href={member.link} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                                {' '}
                                                LinkedIn
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Board of Advisors Section */}
            {/* <section className="py-10 md:py-10 dark:bg-transparent">
                <div className="mx-auto max-w-5xl border-t px-6">
                    <div className="mt-10 gap-4 sm:grid sm:grid-cols-2 md:mt-10">
                        <div className="sm:w-4/5">
                            <h2 className="text-3xl font-bold sm:text-4xl">Our Board of Advisors</h2>
                        </div>
                        <div className="mt-6 sm:mt-0">
                            <p></p>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-10">
                        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 place-items-center mx-auto max-w-3xl">
                            {advisors.map((advisor, index) => (
                                <div key={index} className="group overflow-hidden">
                                    <div className="flex justify-center">
                                        <img 
                                            className="w-120 h-120 rounded-md object-cover object-top grayscale transition-all duration-500 hover:grayscale-0 group-hover:h-[22.5rem] group-hover:rounded-xl" 
                                            src={advisor.avatar} 
                                            alt="advisor" 
                                            width="826" 
                                            height="1239" 
                                        />
                                    </div>
                                    <div className="px-2 pt-2 sm:pb-0 sm:pt-4">
                                        <div className="flex justify-between">
                                            <h3 className="text-title text-base font-medium transition-all duration-500 group-hover:tracking-wider">{advisor.name}</h3>
                                        </div>
                                        <div className="mt-1 flex items-center justify-between">
                                            <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">{advisor.role}</span>
                                            <Link href={advisor.link} className="group-hover:text-primary-600 dark:group-hover:text-primary-400 inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                                                {' '}
                                                LinkedIn
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    )
}
