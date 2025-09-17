export default function Home() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
      {/* Cabeçalho */}
      <header
        style={{
          backgroundColor: "#ff0000",
          color: "#fff",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h1>Instituição Pública XYZ</h1>
        <nav>
          <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
            Início
          </a>
          <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
            Serviços
          </a>
          <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
            Contato
          </a>
          <a href="#" style={{ color: "#fff", margin: "0 10px" }}>
            Mais
          </a>
        </nav>
      </header>

      {/* Conteúdo principal */}
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h2>Bem-vindo!</h2>
        <p>
          Este é o site oficial da Instituição Pública XYZ. Aqui você encontra
          informações sobre serviços, contatos e novidades.
        </p>
      </main>

      {/* Rodapé */}
      <footer
        style={{
          backgroundColor: "#f1f1f1",
          padding: "15px",
          textAlign: "center",
        }}
      >
        <p>&copy; 2025 Instituição Pública XYZ - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
