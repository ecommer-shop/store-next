import { Button } from '@/components/ui/button';
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button asChild>
                        <Link href="/">Go to Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
