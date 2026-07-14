import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function PlansPage() {
  return (
    <>
      <Helmet>
        <title>Planos - PhotoGuide</title>
      </Helmet>

      <Header />

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-bold mb-4">
          Planos
        </h1>

        <p className="text-lg text-muted-foreground">
          O sistema de assinatura será implementado em uma sprint futura.
        </p>
      </main>

      <Footer />
    </>
  );
}