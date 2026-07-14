import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function PropertyRegistrationPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    propertyType: 'Apartamento'
  });

  const propertyTypes = ['Apartamento', 'Casa', 'Comercial', 'Terreno', 'Condomínio'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const record = await pb.collection('properties').create({
        ...formData,
        userId: currentUser.id,
        selectedEnvironments: []
      }, { $autoCancel: false });

      navigate(`/property/${record.id}/environments`);
    } catch (err) {
      console.error('Error creating property:', err);
      setError('Erro ao criar imóvel. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Novo Imóvel - PhotoGuide Imóveis</title>
        <meta name="description" content="Cadastre um novo imóvel para fotografar" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-2xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Dashboard
          </button>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-semibold mb-2">Novo Imóvel</h1>
            <p className="text-muted-foreground mb-6">Preencha as informações básicas do imóvel</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nome do imóvel
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Ex: Apto 301 - Edifício Jardins"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">
                  Endereço completo
                </label>
                <input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Rua, número, bairro, cidade"
                />
              </div>

              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium mb-2">
                  Tipo de imóvel
                </label>
                <select
                  id="propertyType"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  required
                  className="w-full rounded-lg border bg-background px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 rounded-lg border bg-background px-4 py-3 font-medium hover:bg-muted transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Criando...' : 'Continuar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}