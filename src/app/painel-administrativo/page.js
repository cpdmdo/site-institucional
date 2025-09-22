"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase-client';

export default function PainelAdministrativo() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            // Se houver erro ou a sessão não existir, redireciona para o login
            if (error || !session) {
                router.push('/login');
            } else {
                // Se o usuário estiver logado, armazena as informações dele no estado
                setUser(session.user);
            }
        };

        checkUser();

        // Ouve por mudanças de autenticação (login, logout) em tempo real
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT') {
                    // Se o usuário fizer logout, redireciona para a página de login
                    router.push('/login');
                } else if (event === 'SIGNED_IN') {
                    // Se o usuário fizer login, armazena as informações
                    setUser(session.user);
                }
            }
        );

        // Retorna uma função de limpeza para o listener
        return () => {
            authListener?.unsubscribe();
        };
    }, [router]);

    // Exibe uma mensagem de carregamento enquanto verifica o status de autenticação
    if (!user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Carregando...</p>
            </div>
        );
    }

    // Conteúdo da página do painel administrativo
    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                paddingBottom: '20px'
            }}>
                <h1 style={{ margin: 0 }}>Painel Administrativo</h1>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <p style={{ margin: '0 20px 0 0', fontWeight: 'bold' }}>
                        Bem-vindo, {user.email}!
                    </p>
                    <button
                        onClick={async () => {
                            await supabase.auth.signOut();
                            // O listener vai cuidar do redirecionamento
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Sair
                    </button>
                </div>
            </div>
            <div style={{ marginTop: '20px' }}>
                <p>Você está na área restrita do painel administrativo.</p>
                <p>Use este espaço para gerenciar as seções do seu site institucional, como notícias, portfólio ou informações de contato.</p>
                {/* Aqui você pode adicionar mais funcionalidades, como links para gerenciar dados */}
            </div>
        </div>
    );
}
