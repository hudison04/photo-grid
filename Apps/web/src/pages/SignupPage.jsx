import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== passwordConfirm) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signup(email, password, passwordConfirm, name);
      navigate('/dashboard');
    } catch (err) {
      if (err.message?.includes('email')) {
        setError('Este email já está em uso');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Criar conta - PhotoGuide Imóveis</title>
        <meta name="description" content="Crie sua conta PhotoGuide Imóveis e comece a fotografar imóveis profissionalmente" />
      </Helmet>
      <Header />
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-semibold mb-2">Criar conta</h1>
            <p className="text-muted-foreground mb-6">Comece a fotografar imóveis profissionalmente</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-2">
                  Confirmar senha
                </label>
                <input
                  id="passwordConfirm"
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  required
                  minLength={8}
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Digite a senha novamente"
                />
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}