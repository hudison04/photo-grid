import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useAuth } from '@/contexts/AuthContext.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou senha incorretos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Entrar - PhotoGuide Imóveis</title>
        <meta name="description" content="Faça login na sua conta PhotoGuide Imóveis" />
      </Helmet>
      <Header />
      <main className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border bg-card p-8 shadow-lg">
            <h1 className="text-2xl font-semibold mb-2">Bem-vindo de volta</h1>
            <p className="text-muted-foreground mb-6">Entre com sua conta para continuar</p>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="••••••••"
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
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}