import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Trash2, Camera, CheckCircle2, X } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function ReviewGalleryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [completedEnvironments, setCompletedEnvironments] = useState(new Set());

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const [propertyRecord, photoRecords] = await Promise.all([
        pb.collection('properties').getOne(id, { $autoCancel: false }),
        pb.collection('photos').getFullList({
          filter: `propertyId = "${id}"`,
          sort: 'environmentName,photoIndex',
          $autoCancel: false
        })
      ]);

      setProperty(propertyRecord);
      setPhotos(photoRecords);

      const completed = new Set();
      const envGroups = {};
      photoRecords.forEach(photo => {
        if (!envGroups[photo.environmentName]) {
          envGroups[photo.environmentName] = [];
        }
        envGroups[photo.environmentName].push(photo);
      });

      Object.entries(envGroups).forEach(([env, envPhotos]) => {
        if (envPhotos.every(p => p.completed)) {
          completed.add(env);
        }
      });

      setCompletedEnvironments(completed);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePhoto = async (photoId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) return;

    try {
      await pb.collection('photos').delete(photoId, { $autoCancel: false });
      setPhotos(photos.filter(p => p.id !== photoId));
      setSelectedPhoto(null);
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  const toggleEnvironmentComplete = async (environmentName) => {
    const envPhotos = photos.filter(p => p.environmentName === environmentName);
    const newCompleted = !completedEnvironments.has(environmentName);

    try {
      await Promise.all(
        envPhotos.map(photo =>
          pb.collection('photos').update(photo.id, { completed: newCompleted }, { $autoCancel: false })
        )
      );

      const newSet = new Set(completedEnvironments);
      if (newCompleted) {
        newSet.add(environmentName);
      } else {
        newSet.delete(environmentName);
      }
      setCompletedEnvironments(newSet);
    } catch (error) {
      console.error('Error updating completion status:', error);
    }
  };

  const groupedPhotos = photos.reduce((acc, photo) => {
    if (!acc[photo.environmentName]) {
      acc[photo.environmentName] = [];
    }
    acc[photo.environmentName].push(photo);
    return acc;
  }, {});

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
        <title>{`Revisão - ${property?.name || 'Imóvel'} - PhotoGuide Imóveis`}</title>
        <meta name="description" content="Revise e organize as fotos capturadas" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate('/dashboard')}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar ao Dashboard
          </button>

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-2">{property?.name}</h1>
              <p className="text-muted-foreground">Revise e organize as fotos capturadas</p>
            </div>
            <button
              onClick={() => navigate(`/property/${id}/completion`)}
              className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Concluir
            </button>
          </div>

          {Object.keys(groupedPhotos).length === 0 ? (
            <div className="rounded-xl border bg-card p-12 text-center shadow-sm">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma foto capturada</h3>
              <p className="text-muted-foreground mb-6">Comece capturando fotos dos ambientes</p>
              <button
                onClick={() => navigate(`/property/${id}/environments`)}
                className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground hover:bg-primary/90 transition-all"
              >
                Iniciar Captura
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedPhotos).map(([environmentName, envPhotos]) => (
                <div key={environmentName} className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">{environmentName}</h2>
                      <span className="rounded-full bg-muted px-3 py-1 text-sm font-medium">
                        {envPhotos.length} {envPhotos.length === 1 ? 'foto' : 'fotos'}
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={completedEnvironments.has(environmentName)}
                        onChange={() => toggleEnvironmentComplete(environmentName)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium">Marcar como completo</span>
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {envPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="group relative aspect-video overflow-hidden rounded-lg border bg-muted cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={pb.files.getURL(photo, photo.image)}
                          alt={`${environmentName} - Foto ${photo.photoIndex + 1}`}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePhoto(photo.id);
                          }}
                          className="absolute top-2 right-2 rounded-lg bg-destructive p-2 text-white opacity-0 group-hover:opacity-100 hover:bg-destructive/90 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 rounded-lg bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={pb.files.getURL(selectedPhoto, selectedPhoto.image)}
            alt={`${selectedPhoto.environmentName} - Foto ${selectedPhoto.photoIndex + 1}`}
            className="max-h-full max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </>
  );
}