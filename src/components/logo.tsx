import { cn } from '@/lib/utils'
import Image from 'next/image'


export const Logo = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/images/Logo.svg"  
            alt="Logo"
            width={71}
            height={25}
            unoptimized
            className={cn('h-10 w-auto', className)}
            priority
        />
    )
}