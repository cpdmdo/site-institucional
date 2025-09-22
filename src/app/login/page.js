"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // <-- Importe aqui
import { supabase } from '../../lib/supabase-client';

export default function Login() {
    const router = useRouter(); // <-- Chame aqui

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/painel-administrativo'); // <-- Use aqui
        }
    };

    return (
        // ... restante do JSX
    );
}