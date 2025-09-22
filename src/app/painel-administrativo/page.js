"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase-client';

// Componente do formulário de notícias
function FormularioNoticia({ noticia, onClose, onSave }) {
    const [titulo, setTitulo] = useState(noticia?.titulo || '');
    const [conteudo, setConteudo] = useState(noticia?.conteudo || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const dataToSave = {
            titulo,
            conteudo,
            data_publicacao: new Date().toISOString(),
        };

        if (noticia) {
            // Lógica para editar uma notícia existente
            const { error } = await supabase
                .from('noticias')
                .update(dataToSave)
                .eq('id', noticia.id);

            if (error) {
                console.error('Erro ao atualizar notícia:', error);
            }
        } else {
            // Lógica para criar uma nova notícia
            const { error } = await supabase
                .from('noticias')
                .insert([dataToSave]);

            if (error) {
                console.error('Erro ao adicionar notícia:', error);
            }
        }
        
        setLoading(false);
        onSave();
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
            <h3>{noticia ? 'Editar Notícia' : 'Adicionar Nova Notícia'}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Título</label>
                    <input
                        type="text"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Conteúdo</label>
                    <textarea
                        value={conteudo}
                        onChange={(e) => setConteudo(e.target.value)}
                        required
                        rows="5"
                        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#95a5a6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

// Componente principal do Painel Administrativo
export default function PainelAdministrativo() {
    const [user, setUser] = useState(null);
    const [noticias, setNoticias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formularioVisivel, setFormularioVisivel] = useState(false);
    const [noticiaEditando, setNoticiaEditando] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error || !session) {
                router.push('/login');
            } else {
                setUser(session.user);
            }
        };

        const fetchNoticias = async () => {
            const { data, error } = await supabase
                .from('noticias')
                .select('*')
                .order('data_publicacao', { ascending: false });
            if (error) {
                console.error('Erro ao buscar notícias:', error.message);
            } else {
                setNoticias(data);
            }
            setLoading(false);
        };

        checkUser();
        fetchNoticias();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (event === 'SIGNED_OUT') {
                    router.push('/login');
                } else if (event === 'SIGNED_IN') {
                    setUser(session.user);
                }
            }
        );

        const noticiasListener = supabase
            .channel('public:noticias')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'noticias' },
                () => fetchNoticias()
            )
            .subscribe();

        return () => {
            authListener?.unsubscribe();
            noticiasListener?.unsubscribe();
        };
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    const handleAdicionarNoticia = () => {
        setFormularioVisivel(true);
        setNoticiaEditando(null); // Limpa o formulário de edição
    };

    const handleEditarNoticia = (noticia) => {
        setFormularioVisivel(true);
        setNoticiaEditando(noticia);
    };

    const handleDeleteNoticia = async (id) => {
        if (window.confirm('Tem certeza de que deseja excluir esta notícia?')) {
            const { error } = await supabase
                .from('noticias')
                .delete()
                .eq('id', id);
            
            if (error) {
                console.error('Erro ao excluir notícia:', error);
            }
        }
    };

    const handleFormClose = () => {
        setFormularioVisivel(false);
        setNoticiaEditando(null);
    };

    const handleFormSave = () => {
        setFormularioVisivel(false);
        setNoticiaEditando(null);
    };

    if (loading || !user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Carregando...</p>
            </div>
        );
    );
    }

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
            {!formularioVisivel && (
                <button
                    onClick={handleAdicionarNoticia}
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
            )}

            {formularioVisivel && (
                <FormularioNoticia
                    noticia={noticiaEditando}
                    onClose={handleFormClose}
                    onSave={handleFormSave}
                />
            )}

            {!formularioVisivel && (
                noticias.length > 0 ? (
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
                                        <button
                                            onClick={() => handleEditarNoticia(noticia)}
                                            style={{ padding: '8px 12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px' }}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNoticia(noticia.id)}
                                            style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma notícia encontrada. Comece adicionando uma!</p>
                )
            )}
        </div>
    );
}
