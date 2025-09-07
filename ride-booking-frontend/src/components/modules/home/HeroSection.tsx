import Logo from "@/assets/Logo";

export default function HeroSection() {

    return (
        <section className="relative overflow-hidden py-32 min-h-screen">
            <div className="absolute inset-x-0 top-0 flex h-full w-full items-center justify-center opacity-100">
                <img
                    alt="background"
                    src="https://res.cloudinary.com/dpfdsilzj/image/upload/v1756929315/nyr3bk86api-1756929310719-coxs-bazar-image-24u842-png.png.png"
                />
            </div>
            <div className="relative z-10 container mx-auto">
                <div className="mx-auto flex max-w-5xl flex-col items-center">
                    <div className="flex flex-col items-center gap-6 text-center">
                        <div className="rounded-xl bg-background/30 p-4 shadow-sm backdrop-blur-sm">
                            <Logo />
                        </div>
                        <div>
                            <h1 className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl">
                                Explore the beauty of{" "}
                                <span className="text-primary">Bangladesh</span>
                            </h1>
                            <p className="mx-auto max-w-3xl text-muted lg:text-xl">
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Elig
                                doloremque mollitia fugiat omnis! Porro facilis quo animi
                                consequatur. Explicabo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}