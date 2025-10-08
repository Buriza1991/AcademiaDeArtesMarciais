import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Modalidades from './components/Modalidades';
import Galeria from './components/Galeria';
import Planos from './components/Planos';
import FormaPagamento from './components/FormaPagamento';
import Cadastro from './components/Cadastro';
import PagamentoPagina from './components/PagamentoPagina';
import PagamentoSucesso from './components/PagamentoSucesso';
import Login from './components/Login';
import Sobre from './components/Sobre';
import Contato from './components/Contato';
import AlunosCadastrados from './components/AlunosCadastrados';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <Modalidades />
            <Galeria />
            <Planos />
            <FormaPagamento />
            <Sobre />
            <Contato />
          </>
        } />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pagamento" element={<PagamentoPagina />} />
        <Route path="/pagamento-sucesso" element={<PagamentoSucesso />} />
        <Route path="/login" element={<Login />} />
        <Route path="/alunos" element={<AlunosCadastrados />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;