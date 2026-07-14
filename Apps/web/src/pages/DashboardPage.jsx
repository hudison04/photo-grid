import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Search, Home, Image, CheckCircle2, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalPhotos: 0,
    completedEnvironments: 0,
    averageProgress: 0
  });

  useEffect(() => {
    loadProperties();
  }, [currentUser]);

  const loadProperties = async () => {
    try {
      const records = await pb.collection('properties').getFullList({
        filter: `userId = "${currentUser.id}"`,
        sort: '-created',
        $autoCancel: false
      });

      setProperties(records);
      calculateStats(records);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async (props) => {
    let totalPhotos = 0;
    let completedEnvs = 0;
    let totalProgress = 0;

    for (const prop of props) {
      try {
        const photos = await pb.collection('photos').getFullList({
          filter: `propertyId = "${prop.id}"`,
          $autoCancel: false
        });

        totalPhotos += photos.length;

        const envGroups = {};
        photos.forEach(photo => {
          if (!envGroups[photo.environmentName]) {
            envGroups[photo.environmentName] = [];
          }
          envGroups[photo.environmentName].push(photo);
        });

        Object.values(envGroups).forEach(envPhotos => {
          if (envPhotos.every(p => p.completed)) {
            completedEnvs++;
          }
        });

        const selectedEnvs = prop.selectedEnvironments?.length || 0;
        if (selectedEnvs > 0) {
          const propProgress = (Object.keys(envGroups).length / selectedEnvs) * 100;
          totalProgress += propProgress;
        }
      } catch (error) {
        console.error('Error calculating stats for property:', error);
      }
    }

    setStats({
      totalProperties: props.length,
      totalPhotos,
      completedEnvironments: completedEnvs,
      averageProgress: props.length > 0 ? Math.round(totalProgress / props.length) : 0
    });
  };

  const filteredProperties = properties.filter(prop =>
    prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prop.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <title>Dashboard - PhotoGuide Imóveis</title>
        <meta name="description" content="Gerencie seus imóveis e fotos" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Gerencie seus imóveis e fotos</p>
            </div>
            <Link
              to="/property/new"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <Plus className="h-5 w-5" />
              Novo Imóvel
            </Link>
          </div>

          <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Home className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Imóveis</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalProperties}</p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Fotos</span>
              </div>
              <p className="text-3xl font-bold">{stats.totalPhotos}</p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Ambientes completos</span>
              </div>
              <p className="text-3xl font-bold">{stats.completedEnvironments}</p>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-primary/10 p-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">Progresso médio</span>
              </div>
              <p className="text-3xl font-bold">{stats.averageProgress}%</p>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome ou endereço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {filteredProperties.length === 0 ? (
              <div className="py-12 text-center">
                <Home className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum imóvel encontrado</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? 'Tente buscar com outros termos' : 'Comece criando seu primeiro imóvel'}
                </p>
                {!searchQuery && (
                  <Link
                    to="/property/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    Novo Imóvel
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => navigate(`/property/${property.id}/environments`)}
                    className="flex items-center justify-between rounded-lg border bg-background p-4 hover:bg-muted cursor-pointer transition-all"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold">{property.name}</h3>
                      <p className="text-sm text-muted-foreground">{property.address}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{property.propertyType}</span>
                        <span>•</span>
                        <span>{new Date(property.created).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-muted-foreground">
                        {property.selectedEnvironments?.length || 0} ambientes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}