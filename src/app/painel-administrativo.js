// pages/painel-administrativo.js
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/router'

export default function PainelAdministrativo() {
    const [user, setUser] = useState(null)
    const router = useRouter()

    useEffect(() => {
        async function getUser() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                // Se não houver sessão, redireciona para a página de login
                router.push('/login')
            } else {
                setUser(session.user)
            }
        }
        getUser()
    }, [router])

    if (!user) {
        // Exibe um estado de carregamento enquanto verifica a sessão
        return <div>Carregando...</div>
    }

    return (
        <div>
            <h1>Bem-vindo ao Painel Administrativo, {user.email}!</h1>
            <p>Aqui você poderá gerenciar todas as seções do site, notícias e configurações.</p>
            {/* Adicione os links para as seções de gerenciamento aqui */}
            {/* Exemplo: <Link href="/painel-administrativo/noticias">Gerenciar Notícias</Link> */}
            <button onClick={() => supabase.auth.signOut()}>Sair</button>
        </div>
    )
}