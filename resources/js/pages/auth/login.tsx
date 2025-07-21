import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout title="Masuk ke Admin Portal" description="Masukkan email dan password untuk mengakses sistem admin Festival Tahuri">
            <Head title="Login Admin - Festival Tahuri" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Admin</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@tahuri.id"
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="ml-auto text-sm text-orange-600 hover:text-orange-700" tabIndex={5}>
                                    Lupa password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Masukkan password"
                            className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onClick={() => setData('remember', !data.remember)}
                            tabIndex={3}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <Label htmlFor="remember">Ingat saya</Label>
                    </div>

                    <Button 
                        type="submit" 
                        className="mt-4 w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
                        tabIndex={4} 
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Masuk Admin Portal
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-600">
                    Belum punya akun admin?{' '}
                    <TextLink href={route('register')} className="text-orange-600 hover:text-orange-700 font-medium" tabIndex={5}>
                        Daftar di sini
                    </TextLink>
                </div>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
            
            {/* Development Login Info */}
            <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h3 className="text-sm font-semibold text-orange-800 mb-2">Demo Login (Development)</h3>
                <div className="text-xs text-orange-700 space-y-1">
                    <p><strong>Email:</strong> admin@tahuri.id</p>
                    <p><strong>Password:</strong> password123</p>
                    <p className="text-orange-600 mt-2">* Akun admin default untuk testing</p>
                </div>
            </div>
        </AuthLayout>
    );
}
