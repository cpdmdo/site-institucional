"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase-client';

export default function PainelAdministrativo() {
    const [user, setUser] = useState(null);
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Função para verificar o status de autenticação do usuário
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error || !session) {
                router.push('/login');
            } else {
                setUser(session.user);
            }
        };

        // Função para buscar as notícias do banco de dados
        const fetchNoticias = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('noticias')
                .select('*')
                .order('data_publicacao', { ascending: false }); // Ordena por data mais recente

            if (error) {
                console.error('Erro ao buscar notícias:', error.message);
            } else {
                setNoticias(data);
            }
            setLoading(false);
        };

        checkUser();
        fetchNoticias();

        // Ouve por mudanças de autenticação e no banco de dados em tempo real
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT') {
                    router.push('/login');
                } else if (event === 'SIGNED_IN') {
                    setUser(session.user);
                }
            }
        );

        // Ouve mudanças na tabela de notícias para atualizar a lista automaticamente
        const noticiasListener = supabase
            .channel('public:noticias')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'noticias' },
                () => fetchNoticias()
            )
            .subscribe();

        // Retorna uma função de limpeza para os listeners
        return () => {
            authListener.unsubscribe();
            noticiasListener.unsubscribe();
        };
    }, [router]);

    // Exibe uma mensagem de carregamento ou a tela de login se não houver usuário
    if (loading || !user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Carregando...</p>
            </div>
        );
    }

    const handleLogout = async () => {
        await supabase.auth.signOut();
        // O listener de autenticação cuidará do redirecionamento
    };

    return (
        <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ccc',
                paddingBottom: '20px',
                marginBottom: '20px'
            }}>
                <h1 style={{ margin: 0 }}>Painel Administrativo</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>Bem-vindo, {user.email}!</p>
                    <button
                        onClick={handleLogout}
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

            <h2>Gerenciar Notícias</h2>
            <button
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                Adicionar Notícia
            </button>

            {noticias.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Título</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Data de Publicação</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {noticias.map((noticia) => (
                            <tr key={noticia.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{noticia.titulo}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(noticia.data_publicacao).toLocaleDateString()}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    <button style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}>
                                        Editar
                                    </button>
                                    <button style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nenhuma notícia encontrada. Comece adicionando uma!</p>
            )}
        </div>
    );
}
