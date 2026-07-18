import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import PublicLayout from '../../Layouts/PublicLayout';
import { Card } from '../../Components/ui/Card';
import Button from '../../Components/ui/Button';
import { ShieldCheck, RefreshCw } from 'lucide-react';

export default function VerifyEmailOtp({ email }) {
    const [code, setCode] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);

    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    useEffect(() => {
        setData('code', code.join(''));
    }, [code]);

    const handleChange = (index, value) => {
        // Only allow numbers
        if (value !== '' && !/^[0-9]$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        // Auto focus next input
        if (value !== '' && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                const newCode = [...code];
                newCode[index - 1] = '';
                setCode(newCode);
                inputRefs.current[index - 1].focus();
            } else {
                const newCode = [...code];
                newCode[index] = '';
                setCode(newCode);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d{6}$/.test(pastedData)) return;

        const newCode = pastedData.split('');
        setCode(newCode);
        inputRefs.current[5].focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.join('').length !== 6) return;
        post(route('otp.verify'));
    };

    const handleResend = (e) => {
        e.preventDefault();
        if (!canResend) return;
        post(route('otp.resend'), {
            onSuccess: () => {
                setTimer(60);
                setCanResend(false);
                setCode(Array(6).fill(''));
                inputRefs.current[0].focus();
            }
        });
    };

    return (
        <>
            <Head title="Vérification OTP" />

            <div className="min-h-screen bg-surface-50 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 font-sans">
                {/* Logo */}
                <div className="max-w-md w-full mx-auto text-center mb-4">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center font-extrabold text-surface-950 shadow-sm">S</span>
                        <span className="font-extrabold text-xl tracking-tight text-surface-900">
                            Sellify<span className="text-primary-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="max-w-md w-full mx-auto flex-grow flex items-center justify-center">
                    <div className="w-full space-y-8">
                        {/* Header */}
                        <div className="text-center space-y-3 animate-fade-in">
                            <div className="inline-flex p-3.5 bg-primary-50 text-primary-600 rounded-2xl border border-primary-100 shadow-sm animate-pulse">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-surface-900 tracking-tight">
                                Vérifier votre compte
                            </h2>
                            <p className="text-sm text-surface-500 font-medium max-w-sm mx-auto leading-relaxed">
                                Nous avons envoyé un code de validation à 6 chiffres par email à :
                                <span className="block font-bold text-surface-800 mt-1">{email}</span>
                            </p>
                        </div>

                        <Card className="bg-white p-8 border border-surface-200 rounded-3xl shadow-sm space-y-6 animate-slide-up">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* OTP inputs container */}
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-surface-400 uppercase tracking-wider block text-center mb-4">
                                        Saisir le code
                                    </label>
                                    <div className="flex justify-between gap-2 max-w-xs mx-auto" onPaste={handlePaste}>
                                        {code.map((num, idx) => (
                                            <input
                                                key={idx}
                                                ref={(el) => (inputRefs.current[idx] = el)}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                value={num}
                                                onChange={(e) => handleChange(idx, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                                className="w-12 h-14 text-center text-xl font-black rounded-xl border border-surface-200 bg-surface-50 text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all shadow-sm"
                                                required
                                            />
                                        ))}
                                    </div>
                                    {errors.code && (
                                        <p className="text-xs font-semibold text-accent-600 text-center mt-3 animate-fade-in">
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full shadow-md py-3"
                                        disabled={processing || code.join('').length !== 6}
                                    >
                                        Confirmer mon adresse e-mail
                                    </Button>
                                </div>
                            </form>

                            <div className="border-t border-surface-100 pt-6 text-center space-y-4">
                                <div className="text-sm font-medium text-surface-500">
                                    Vous n'avez pas reçu le code ?
                                </div>
                                
                                <div>
                                    {canResend ? (
                                        <button
                                            onClick={handleResend}
                                            className="inline-flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" />
                                            <span>Renvoyer le code par email</span>
                                        </button>
                                    ) : (
                                        <span className="text-xs font-semibold text-surface-400">
                                            Renvoyer le code dans {timer}s
                                        </span>
                                    )}
                                </div>
                                
                                {errors.resend && (
                                    <p className="text-xs font-semibold text-accent-600 animate-fade-in">
                                        {errors.resend}
                                    </p>
                                )}
                            </div>
                        </Card>

                        <div className="text-center">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-xs font-bold text-surface-400 hover:text-surface-600 hover:underline"
                            >
                                Se déconnecter
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Simple Footer */}
                <div className="text-center text-xs text-surface-400 mt-8">
                    &copy; {new Date().getFullYear()} Sellify.me. Tous droits réservés.
                </div>
            </div>
        </>
    );
}
