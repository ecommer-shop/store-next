'use client';

import {ProductCard} from "@/components/commerce/product-card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,} from "@/components/ui/carousel";
import {FragmentOf} from "@/graphql";
import {ProductCardFragment} from "@/lib/vendure/shared/fragments";
import {useEffect, useId, useState} from "react";
import type { CarouselApi } from "@/components/ui/carousel";
interface ProductCarouselClientProps {
    title: string;
    products: Array<FragmentOf<typeof ProductCardFragment>>;
}

export function ProductCarousel({title, products}: ProductCarouselClientProps) {
  const id = useId();
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

    return (
        <section className="mt- 6 py-6 md:py-8">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
                 {title}
                </h2>

                <Carousel
                    setApi={setApi}
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {products.map((product, i) => (
                            <CarouselItem key={id + i} 
                                          className="pl-2 md:pl-4 basis-full 
                                          sm:basis-1/2 lg:basis-1/3 xl:basis-1/4
                                          ">
                                <ProductCard product={product}/>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition-all duration-300" />
                    <CarouselNext className="h-10 w-10 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition-all duration-300" />

                </Carousel>
                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: count }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => api?.scrollTo(index)}
                      className={`h-2 rounded-full transition-all duration-300 ease-in-out ${
                        index === current
                          ? "bg-primary w-6"
                          : "bg-muted-foreground/30 w-2 hover:bg-muted-foreground/60"
                      }`}
                      aria-label={`Ir al slide ${index + 1}`}
                    />
                  ))}
                </div>

            </div>
        </section>
    );
}
