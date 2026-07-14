import React from 'react';
import { Helmet } from 'react-helmet';
import SubscriptionAccountSection from '@/components/SubscriptionAccountSection.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SubscriptionsPage() {
  return (
    <>
      <Helmet>
        <title>Assinatura - PhotoGuide Imóveis</title>
        <meta name="description" content="Gerencie sua assinatura e informações de pagamento" />
      </Helmet>
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-3xl font-semibold sm:text-4xl">Sua assinatura</h1>
          <p className="mt-2 text-muted-foreground">
            Visualize seu plano atual e gerencie suas informações de pagamento.
          </p>
        </header>
        <SubscriptionAccountSection />
      </main>
      <Footer />
    </>
  );
}