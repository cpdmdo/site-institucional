// src/app/teste-supabase/page.js
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase-client';

export default function TesteSupabase() {
    const [mensagem, setMensagem] = useState('Testando conexão...');
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function testarConexao() {
            try {
                // Tenta selecionar todos os dados da tabela 'teste_conexao'
                let { data, error } = await supabase
                    .from('teste_conexao')
                    .select('mensagem');

                if (error) {
                    // Se houver erro, atualiza o estado de erro
                    setErro(error.message);
                    setMensagem('Erro ao conectar ao Supabase');
                } else if (data && data.length > 0) {
                    // Se a consulta for bem-sucedida, exibe a mensagem da tabela
                    setMensagem(data[0].mensagem);
                } else {
                    // Se a tabela estiver vazia, avisa o usuário
                    setMensagem('Conexão OK, mas a tabela está vazia.');
                }
            } catch (e) {
                setErro('Ocorreu uma exceção: ' + e.message);
                setMensagem('Erro fatal na conexão');
            }
        }

        testarConexao();
    }, []);

    return (
        <div>
            <h1>Status da Conexão com Supabase</h1>
            <p>{mensagem}</p>
            {erro && <p style={{ color: 'red' }}>Erro: {erro}</p>}
        </div>
    );
}