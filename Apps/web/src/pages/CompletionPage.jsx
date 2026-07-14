import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CheckCircle2, Download, Home, Image, Clock, WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import apiServerClient from '@/lib/apiServerClient';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { offlineSyncManager } from '@/lib/offlineSyncManager.js';

export default function CompletionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [syncStatus, setSyncStatus] = useState(offlineSyncManager.getQueueStatus());

  useEffect(() => {
    loadData();
    
    const unsubscribe = offlineSyncManager.subscribe((status) => {
      setSyncStatus(status);
    });
    
    return () => unsubscribe();
  }, [id]);

  const loadData = async () => {
    try {
      const [propertyRecord, statsResponse] = await Promise.all([
        pb.collection('properties').getOne(id, { $autoCancel: false }),
        apiServerClient.fetch(`/properties/${id}/stats`)
      ]);

      setProperty(propertyRecord);
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (syncStatus.pendingCount > 0) {
      alert('Aguarde a sincronização das fotos offline antes de exportar.');
      return;
    }

    setExporting(true);
    try {
      const response = await apiServerClient.fetch(`/properties/${id}/export`, {
        method: 'POST'
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${property.name}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
    } finally {
      setExporting(false);
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

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes} minutos`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}min`;
  };

  return (
    <>
      <Helmet>
        <title>{`Concluído - ${property?.name || 'Imóvel'} - PhotoGuide Imóveis`}</title>
        <meta name="description" content="Captura concluída com sucesso" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-blue-50 to-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="mb-8 flex justify-center"
          >
            <div className="rounded-full bg-primary/10 p-6">
              <CheckCircle2 className="h-20 w-20 text-primary" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl font-semibold mb-3 sm:text-4xl">Captura concluída</h1>
            <p className="text-lg text-muted-foreground">
              Todas as fotos de {property?.name} foram capturadas com sucesso
            </p>
          </motion.div>

          {syncStatus.pendingCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-amber-800">
                  {syncStatus.isOnline ? <RefreshCw className={`h-5 w-5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} /> : <WifiOff className="h-5 w-5" />}
                  <div>
                    <p className="font-medium">
                      {syncStatus.pendingCount} {syncStatus.pendingCount === 1 ? 'foto pendente' : 'fotos pendentes'} de sincronização
                    </p>
                    <p className="text-sm opacity-80">
                      {syncStatus.isOnline ? 'Sincronizando com o servidor...' : 'Aguardando conexão com a internet'}
                    </p>
                  </div>
                </div>
                {syncStatus.isOnline && !syncStatus.isSyncing && (
                  <button 
                    onClick={() => offlineSyncManager.syncQueue()}
                    className="rounded-md bg-amber-200 px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-300 transition-colors"
                  >
                    Sincronizar Agora
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl border bg-card p-8 shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold mb-6">Resumo da captura</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.selectedEnvironments || 0}</p>
                  <p className="text-sm text-muted-foreground">Ambientes fotografados</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.totalPhotos || 0}</p>
                  <p className="text-sm text-muted-foreground">Fotos capturadas</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.timeSpent ? formatTime(stats.timeSpent) : '0min'}</p>
                  <p className="text-sm text-muted-foreground">Tempo total</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={handleExport}
              disabled={exporting || syncStatus.pendingCount > 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-4 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              <Download className="h-5 w-5" />
              {exporting ? 'Exportando...' : 'Exportar ZIP'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 rounded-lg border bg-background px-6 py-4 font-medium hover:bg-muted active:scale-[0.98] transition-all"
            >
              Fotografar outro imóvel
            </button>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}