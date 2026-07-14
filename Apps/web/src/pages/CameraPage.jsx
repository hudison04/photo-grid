import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Camera, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useCapacitorCamera } from '@/hooks/useCapacitorCamera.js';
import { offlineSyncManager } from '@/lib/offlineSyncManager.js';

export default function CameraPage() {
  const { id, environmentIndex } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [currentEnvironment, setCurrentEnvironment] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [localError, setLocalError] = useState('');
  
  const { takePicture, pickFromGallery, error: cameraError } = useCapacitorCamera();

  const instructions = [
    'Posicione-se no canto esquerdo e fotografe em direção ao canto oposto',
    'Agora do canto oposto, fotografe em direção ao canto inicial',
    'Tire uma foto vertical mostrando a altura do ambiente',
    'Capture um detalhe importante do ambiente (acabamento, vista, etc.)'
  ];

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const record = await pb.collection('properties').getOne(id, { $autoCancel: false });
      setProperty(record);
      const envIndex = parseInt(environmentIndex);
      if (record.selectedEnvironments && record.selectedEnvironments[envIndex]) {
        setCurrentEnvironment(record.selectedEnvironments[envIndex]);
      }
    } catch (error) {
      console.error('Error loading property:', error);
      setLocalError('Erro ao carregar imóvel');
    }
  };

  const handleCapture = async (useGallery = false) => {
    setCapturing(true);
    setLocalError('');

    try {
      const photo = useGallery ? await pickFromGallery() : await takePicture();
      
      if (!photo) {
        setCapturing(false);
        return; // User cancelled or error occurred
      }

      const photoData = {
        propertyId: id,
        environmentName: currentEnvironment,
        photoIndex: currentPhotoIndex,
        completed: false,
        base64Data: photo.base64Data
      };

      if (navigator.onLine) {
        // Online: Upload directly
        const res = await fetch(photo.base64Data);
        const blob = await res.blob();
        const formData = new FormData();
        formData.append('propertyId', photoData.propertyId);
        formData.append('environmentName', photoData.environmentName);
        formData.append('photoIndex', photoData.photoIndex);
        formData.append('completed', photoData.completed);
        formData.append('image', blob, `${currentEnvironment}_${currentPhotoIndex}.jpg`);

        await pb.collection('photos').create(formData, { $autoCancel: false });
      } else {
        // Offline: Add to queue
        await offlineSyncManager.addToQueue(photoData);
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 1500);

      if (currentPhotoIndex < 3) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
      } else {
        const nextEnvIndex = parseInt(environmentIndex) + 1;
        if (property.selectedEnvironments && nextEnvIndex < property.selectedEnvironments.length) {
          navigate(`/property/${id}/capture/${nextEnvIndex}`);
        } else {
          navigate(`/property/${id}/review`);
        }
      }
    } catch (error) {
      console.error('Error processing photo:', error);
      setLocalError('Erro ao processar foto. Tente novamente.');
    } finally {
      setCapturing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{`Captura - ${currentEnvironment} - PhotoGuide Imóveis`}</title>
        <meta name="description" content="Capture fotos do ambiente" />
      </Helmet>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] bg-black">
        <div className="relative h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
          <button
            onClick={() => navigate(`/property/${id}/environments`)}
            className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur hover:bg-black/70 transition-all"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar
          </button>

          <div className="absolute top-4 right-4 z-10 rounded-lg bg-black/50 px-4 py-2 text-white backdrop-blur">
            <p className="text-sm font-medium">
              Foto {currentPhotoIndex + 1} de 4
            </p>
          </div>

          <div className="absolute top-20 left-4 right-4 z-10">
            <div className="rounded-lg bg-black/50 p-4 text-white backdrop-blur text-center">
              <h2 className="text-xl font-semibold mb-2">{currentEnvironment}</h2>
              <p className="text-sm leading-relaxed">{instructions[currentPhotoIndex]}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 z-10">
            <button
              onClick={() => handleCapture(false)}
              disabled={capturing}
              className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-primary hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-2xl"
            >
              <Camera className="h-10 w-10 text-white" />
            </button>
            
            <button
              onClick={() => handleCapture(true)}
              disabled={capturing}
              className="flex items-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-white backdrop-blur hover:bg-white/20 transition-all"
            >
              <ImageIcon className="h-5 w-5" />
              Escolher da Galeria
            </button>
          </div>

          {showSuccess && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur">
              <div className="rounded-xl bg-white p-6 shadow-xl text-center">
                <CheckCircle2 className="mx-auto h-16 w-16 text-primary mb-3" />
                <p className="text-lg font-semibold text-foreground">Foto salva</p>
              </div>
            </div>
          )}

          {(localError || cameraError) && (
            <div className="absolute top-48 left-4 right-4 z-20 rounded-lg bg-destructive/90 p-4 text-white backdrop-blur">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{localError || cameraError}</p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}