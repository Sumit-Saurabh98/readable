
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";


interface featuresProps {
    title: string,
    description: string,
    icon: string
}

const features: featuresProps[] = [
    {
        title: "Comphensive Course",
        description: "Access a wide range of carefully curedted courses designed by industries experts.",
        icon: '📚'
    },
    {
        title: "Interactive Learning",
        description: "Engage with interactive content, puzzles and assignments to enhance your learning experience.",
        icon: '🎮'
    },
    {
        title: "Progress Tracking",
        description: "Monitor your progress and achievements with detailed analytics and personialized dashboard.",
        icon: '📊'
    },
    {
        title: "Community Support",
        description: "Join a vibrant community of learners and mentors to share knowledge and support each other.",
        icon: '👥'
    },
]

export default function Home() {

  return (
   <>
   <section className="relative py-20">
    <div className="flex flex-col items-center text-center space-y-8">
        <Badge variant={"outline"}>
            The Future of Online Education
        </Badge>
    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Elevate you learning experience</h1>
    <p className="max-w-[700px] text-muted-foreground text-xl">Dicover a new way to learn with our modern, interactive platform. Access high quality content from anywhere, anytime.</p>
    <div className="flex flex-col md:flex-row gap-4 mt-8">
        <Link href="/courses" className={buttonVariants({
            size: "lg",
            className: "w-full md:w-auto"
        })}>Explore Courses</Link>
        <Link href="/login" className={buttonVariants({
            size: "lg",
            className: "w-full md:w-auto",
            variant: "outline"
        })}>Sign in</Link>
    </div>
    </div>
   </section>

   <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 mb-32">
    {
        features.map((feature, i) =>{
            return (
                <Card key={i} className="hover:shadow-lg transition-shadow">
                    <CardHeader >
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                </Card>
            )
        })
    }
   </section>
   </>
  );
}
