import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-br from-orange-50 via-white to-red-50 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl p-6 shadow-lg">
                        <div className="flex flex-col items-center gap-4 mb-8">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium group">
                                <div className="text-center">
                                    <div className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent group-hover:scale-105 transition-all duration-200">
                                        Festival Tahuri
                                    </div>
                                    <div className="text-xs text-gray-500 font-medium">Admin Portal</div>
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-3 text-center">
                                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                                <p className="text-center text-sm text-gray-600">{description}</p>
                            </div>
                        </div>
                        
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
