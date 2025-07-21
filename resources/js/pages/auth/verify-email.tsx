// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Verifikasi Email" description="Silakan verifikasi alamat email Anda dengan mengklik link yang telah kami kirimkan.">
            <Head title="Verifikasi Email - Festival Tahuri" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                    Link verifikasi baru telah dikirim ke alamat email yang Anda berikan saat pendaftaran.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button 
                    disabled={processing} 
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Kirim Ulang Email Verifikasi
                </Button>

                <TextLink 
                    href={route('logout')} 
                    method="post" 
                    className="mx-auto block text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    Keluar
                </TextLink>
            </form>
        </AuthLayout>
    );
}
