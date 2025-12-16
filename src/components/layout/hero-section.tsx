import {Button} from "@heroui/react";
import Link from "next/link";

export function HeroSection() {
    return (
        <section className="relative bg-muted overflow-hidden">
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-2">
                        Ecommer!
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis maiores 
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button asChild size="lg" className="min-w-[200px] bg-[#6BB8FF] dark:bg-[#9969F8] ">
                            <Link href="/search">
                                Shop Now
                            </Link>
                        </Button>
                        
                    </div>
                </div>
            </div>

        </section>
    );
}
