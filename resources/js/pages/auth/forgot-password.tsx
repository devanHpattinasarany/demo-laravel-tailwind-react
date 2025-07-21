// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <AuthLayout title="Lupa Password" description="Masukkan email Anda untuk menerima link reset password">
            <Head title="Lupa Password - Festival Tahuri" />

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">{status}</div>}

            <div className="space-y-6">
                <form onSubmit={submit}>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Admin</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            autoFocus
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@tahuri.id"
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />

                        <InputError message={errors.email} />
                    </div>

                    <div className="my-6 flex items-center justify-start">
                        <Button 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Kirim Link Reset Password
                        </Button>
                    </div>
                </form>

                <div className="space-x-1 text-center text-sm text-gray-600">
                    <span>Atau, kembali ke</span>
                    <TextLink href={route('login')} className="text-orange-600 hover:text-orange-700 font-medium">halaman login</TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}
