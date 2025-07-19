import { Link } from '@inertiajs/react';
import { Facebook, Heart, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Logo & Description */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <img src="/images/main logo1.png" alt="Tahuri Events" className="h-10 w-auto" />
                        </div>
                        <p className="text-sm leading-relaxed text-gray-300">
                            Platform registrasi event untuk Raburabu Market Vol 9 x Festival Tahuri. Memadukan kreativitas UMKM lokal dengan talkshow
                            inspiratif.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 transition-colors hover:text-orange-400">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-orange-400">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 transition-colors hover:text-orange-400">
                                <Youtube className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Menu Utama</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/" className="text-sm text-gray-300 transition-colors hover:text-orange-400">
                                    Beranda
                                </Link>
                            </li>
                            <li>
                                <a href="#events-section" className="text-sm text-gray-300 transition-colors hover:text-orange-400">
                                    Event
                                </a>
                            </li>
                            <li>
                                <a href="#about" className="text-sm text-gray-300 transition-colors hover:text-orange-400">
                                    Tentang
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="text-sm text-gray-300 transition-colors hover:text-orange-400">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Event Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Event Info</h3>
                        <ul className="space-y-2 text-sm text-gray-300">
                            <li>Raburabu Market Vol 9</li>
                            <li>Festival Tahuri 2024</li>
                            <li>UMKM Showcase</li>
                            <li>Talkshow Inspiratif</li>
                            <li>Registrasi Gratis</li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Kontak</h3>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-orange-400" />
                                <span className="text-sm text-gray-300">
                                    Ambon, Maluku
                                    <br />
                                    Indonesia
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="h-4 w-4 flex-shrink-0 text-orange-400" />
                                <span className="text-sm text-gray-300">info@tahurievents.com</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="h-4 w-4 flex-shrink-0 text-orange-400" />
                                <span className="text-sm text-gray-300">+62 xxx-xxxx-xxxx</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-800 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                        <div className="text-sm text-gray-400">© 2024 Tahuri Events. All rights reserved.</div>
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                            <span>Made with</span>
                            <Heart className="h-4 w-4 text-red-400" />
                            <span>for Maluku Community</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
