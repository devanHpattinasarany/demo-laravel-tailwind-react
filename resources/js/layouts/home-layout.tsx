import { HomeNavbar } from '@/components/home-navbar';
import type { PropsWithChildren } from 'react';

export default function HomeLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-background">
            <HomeNavbar />
            <main>
                {children}
            </main>
        </div>
    );
}