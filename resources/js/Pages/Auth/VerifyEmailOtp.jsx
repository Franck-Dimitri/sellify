import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';

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
        if (value !== '' && !/^[0-9]$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

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
        <div className="min-h-screen bg-stone-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-stone-800">
            <Head title="Vérification OTP - Sellify" />

            <div className="max-w-md w-full mx-auto space-y-6">
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center space-x-2">
                        <span className="w-9 h-9 rounded-lg bg-yellow-500 flex items-center justify-center font-bold text-stone-950 shadow-xs">S</span>
                        <span className="font-bold text-xl tracking-tight text-stone-900">
                            Sellify<span className="text-yellow-600">.me</span>
                        </span>
                    </Link>
                </div>

                <div className="bg-white border border-stone-200 rounded-xl p-8 shadow-sm space-y-6">
                    <div className="text-center space-y-1">
                        <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center mx-auto mb-2">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-semibold text-stone-900">Vérification de sécurité</h1>
                        <p className="text-xs text-stone-500 font-normal">
                            Un code de validation à 6 chiffres a été envoyé à <span className="font-medium text-stone-800">{email}</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-between gap-2 max-w-xs mx-auto">
                            {code.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-11 h-12 text-center text-lg font-semibold bg-stone-50 border border-stone-200 rounded-lg outline-none focus:border-yellow-500 focus:bg-white text-stone-900 transition-all font-mono"
                                    required
                                />
                            ))}
                        </div>

                        {errors.code && (
                            <p className="text-center text-xs text-rose-600 font-medium">{errors.code}</p>
                        )}

                        <button
                            type="submit"
                            disabled={processing || code.join('').length !== 6}
                            className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-600 text-stone-950 font-medium text-xs rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                            <span>Valider mon compte</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                    </form>

                    <div className="text-center text-xs space-y-2 pt-2 border-t border-stone-100">
                        <p className="text-stone-500 font-normal">
                            Vous n'avez pas reçu de code ?{' '}
                            {canResend ? (
                                <button
                                    onClick={handleResend}
                                    className="text-yellow-700 hover:underline font-medium inline-flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" />
                                    <span>Renvoyer le code</span>
                                </button>
                            ) : (
                                <span className="text-stone-400 font-mono">
                                    Renvoyer dans {timer}s
                                </span>
                            )}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
