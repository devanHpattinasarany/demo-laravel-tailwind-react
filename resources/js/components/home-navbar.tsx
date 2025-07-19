import { Link } from '@inertiajs/react';
import { Home, Calendar, Info, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export function HomeNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div className={`fixed top-0 z-50 w-full transition-all duration-300 ${
                isScrolled 
                    ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40' 
                    : 'bg-transparent'
            }`}>
                <div className="container mx-auto">
                    <div className="flex h-20 items-center justify-between">
                        {/* Logo Only */}
                        <div className="flex items-center">
                            <Link href="/">
                                <img 
                                    src="/images/main logo1.png" 
                                    alt="Tahuri Events" 
                                    className="h-10 w-auto"
                                />
                            </Link>
                        </div>

                        {/* Desktop Navigation - Right Side */}
                        <nav className="hidden md:flex items-center space-x-6 text-base font-medium">
                            <Link 
                                href="/" 
                                className="flex items-center space-x-2 transition-all duration-200 text-foreground px-4 py-2.5 rounded-full bg-orange-50/50 hover:bg-orange-100 hover:text-orange-700 border border-orange-100/50 hover:border-orange-200"
                            >
                                <Home className="h-5 w-5" />
                                <span>Beranda</span>
                            </Link>
                            <a 
                                href="#events-section" 
                                className="flex items-center space-x-2 transition-all duration-200 text-foreground/80 px-4 py-2.5 rounded-full bg-gray-50/50 hover:bg-orange-100 hover:text-orange-700 border border-gray-100/50 hover:border-orange-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const eventsSection = document.getElementById('events-section');
                                    eventsSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <Calendar className="h-5 w-5" />
                                <span>Event</span>
                            </a>
                            <a 
                                href="#about-section"
                                className="flex items-center space-x-2 transition-all duration-200 text-foreground/80 px-4 py-2.5 rounded-full bg-gray-50/50 hover:bg-orange-100 hover:text-orange-700 border border-gray-100/50 hover:border-orange-200"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const aboutSection = document.getElementById('about-section');
                                    aboutSection?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <Info className="h-5 w-5" />
                                <span>Tentang</span>
                            </a>
                        </nav>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="inline-flex items-center justify-center p-3 rounded-lg text-foreground hover:text-orange-600 hover:bg-orange-50 transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <Menu className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Mobile Menu - Outside container for full width */}
            {isMobileMenuOpen && (
                <div className="fixed top-20 left-0 right-0 z-40 md:hidden w-full border-t border-orange-200 bg-white shadow-lg">
                    <nav className="flex flex-col">
                        <Link 
                            href="/" 
                            className="flex items-center space-x-2 px-4 py-3 transition-colors hover:bg-orange-50 text-foreground w-full border-b border-orange-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            <Home className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-sm">Beranda</span>
                        </Link>
                        <a 
                            href="#events-section" 
                            className="flex items-center space-x-2 px-4 py-3 transition-colors hover:bg-orange-50 text-foreground w-full border-b border-orange-100"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                const eventsSection = document.getElementById('events-section');
                                eventsSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <Calendar className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-sm">Event</span>
                        </a>
                        <a 
                            href="#about-section"
                            className="flex items-center space-x-2 px-4 py-3 transition-colors hover:bg-orange-50 text-foreground w-full"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsMobileMenuOpen(false);
                                const aboutSection = document.getElementById('about-section');
                                aboutSection?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            <Info className="h-4 w-4 text-orange-600" />
                            <span className="font-medium text-sm">Tentang</span>
                        </a>
                    </nav>
                </div>
            )}
        </>
    );
}