import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Apakah registrasi festival benar-benar gratis?",
    answer: "Ya, registrasi untuk Raburabu Market Vol 9 x Festival Tahuri 100% gratis untuk semua kalangan. Tidak ada biaya tersembunyi atau biaya tambahan."
  },
  {
    question: "Apa saja yang bisa saya dapatkan di festival ini?",
    answer: "Anda bisa menikmati showcase UMKM lokal, talkshow inspiratif dari entrepreneur sukses, doorprize menarik, networking dengan komunitas kreatif, dan berbagai aktivitas seru lainnya."
  },
  {
    question: "Dimana lokasi festival akan diselenggarakan?",
    answer: "Festival akan diselenggarakan di Ambon, Maluku. Informasi detail lokasi akan dikirimkan melalui email setelah registrasi berhasil."
  },
  {
    question: "Kapan festival akan berlangsung?",
    answer: "Informasi jadwal lengkap akan diumumkan setelah registrasi. Pastikan Anda mengisi email dengan benar untuk mendapatkan update terbaru."
  },
  {
    question: "Siapa saja yang bisa mengikuti festival ini?",
    answer: "Festival terbuka untuk semua kalangan - entrepreneur, pelajar, mahasiswa, UMKM, kreator, dan masyarakat umum yang tertarik dengan dunia kreativitas dan bisnis."
  },
  {
    question: "Bagaimana cara mendaftar?",
    answer: "Cara mendaftar sangat mudah! Klik tombol 'Daftar Gratis Sekarang', isi formulir pendaftaran, dan Anda akan mendapatkan konfirmasi melalui email."
  },
  {
    question: "Apakah ada dress code khusus?",
    answer: "Tidak ada dress code khusus. Namun kami menyarankan menggunakan pakaian yang nyaman dan sopan untuk mengikuti seluruh rangkaian acara."
  },
  {
    question: "Bagaimana jika saya tidak bisa hadir setelah mendaftar?",
    answer: "Tidak masalah! Karena gratis, tidak ada penalti jika tidak bisa hadir. Namun mohon informasikan kepada kami agar dapat memberikan kesempatan kepada peserta lain."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-gradient-to-br from-orange-50 via-background to-red-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-orange-800 text-sm font-medium mb-4">
              <HelpCircle className="w-4 h-4" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Pertanyaan yang Sering 
              <span className="bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent"> Ditanyakan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan umum seputar Festival Tahuri. 
              Masih ada pertanyaan? Jangan ragu untuk menghubungi kami!
            </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm border border-orange-100 rounded-xl overflow-hidden hover:border-orange-200 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-orange-50/50 transition-colors"
                >
                  <h3 className="font-semibold text-lg pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-orange-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                </button>
                
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <div className="border-t border-orange-100 pt-4">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 text-center p-8 bg-gradient-to-r from-orange-100/80 to-red-100/80 rounded-xl border border-orange-200">
            <h3 className="text-xl font-semibold mb-2">Masih Ada Pertanyaan?</h3>
            <p className="text-muted-foreground mb-4">
              Tim kami siap membantu Anda! Jangan ragu untuk menghubungi kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a 
                href="mailto:info@tahurievents.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200"
              >
                Email Kami
              </a>
              <a 
                href="tel:+62-xxx-xxxx-xxxx"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-orange-300 text-orange-700 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}