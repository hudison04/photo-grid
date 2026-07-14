import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function EnvironmentChecklistPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedEnvironments, setSelectedEnvironments] = useState([]);

  const environments = [
    'Fachada',
    'Hall',
    'Sala',
    'Sala de Jantar',
    'Cozinha',
    'Área de Serviço',
    'Lavanderia',
    'Banheiro Social',
    'Lavabo',
    'Suíte',
    'Quarto 1',
    'Quarto 2',
    'Closet',
    'Sacada',
    'Varanda Gourmet',
    'Escritório',
    'Piscina',
    'Churrasqueira',
    'Garagem',
    'Quintal'
  ];

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const record = await pb.collection('properties').getOne(id, { $autoCancel: false });
      setProperty(record);
      setSelectedEnvironments(record.selectedEnvironments || []);
    } catch (error) {
      console.error('Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEnvironment = (env) => {
    setSelectedEnvironments(prev =>
      prev.includes(env)
        ? prev.filter(e => e !== env)
        : [...prev, env]
    );
  };

  const handleContinue = async () => {
    if (selectedEnvironments.length === 0) {
      return;
    }

    setSaving(true);
    try {
      await pb.collection('properties').update(id, {
        selectedEnvironments
      }, { $autoCancel: false });

      navigate(`/property/${id}/capture/0`);
    } catch (error) {
      console.error('Error saving environments:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Ambientes - ${property?.name || 'Imóvel'} - PhotoGuide Imóveis`}</title>
        <meta name="description" content="Selecione os ambientes para fotografar" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Dashboard
          </button>

          <div className="rounded-xl border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold mb-2">{property?.name}</h1>
              <p className="text-muted-foreground">Selecione os ambientes que deseja fotografar</p>
            </div>

            <div className="mb-6 rounded-lg bg-primary/10 p-4">
              <p className="text-sm font-medium text-primary">
                {selectedEnvironments.length} {selectedEnvironments.length === 1 ? 'ambiente selecionado' : 'ambientes selecionados'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
              {environments.map((env) => (
                <label
                  key={env}
                  className="flex items-center gap-3 rounded-lg border bg-background p-4 cursor-pointer hover:bg-muted transition-all"
                >
                  <input
                    type="checkbox"
                    checked={selectedEnvironments.includes(env)}
                    onChange={() => toggleEnvironment(env)}
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                  />
                  <span className="font-medium">{env}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 rounded-lg border bg-background px-4 py-3 font-medium hover:bg-muted transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedEnvironments.length === 0 || saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? 'Salvando...' : 'Iniciar Captura'}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}