import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Camera, Grid3x3, FolderOpen, Download, CheckCircle2, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { LOGIN_PATH } from '@/config/subscriptionRoutes.js';

export default function HomePage() {
  const features = [
    {
      icon: Camera,
      title: 'Captura guiada',
      description: 'Instruções passo a passo para cada foto, garantindo qualidade profissional em todos os ambientes'
    },
    {
      icon: Grid3x3,
      title: 'Organização automática',
      description: 'Fotos organizadas por ambiente e numeradas automaticamente para fácil identificação'
    },
    {
      icon: Download,
      title: 'Exportação rápida',
      description: 'Baixe todas as fotos em ZIP organizado por ambiente, pronto para enviar ao cliente'
    }
  ];

  const benefits = [
    'Guias visuais com grade e nível para fotos perfeitamente alinhadas',
    'Checklist de 20 ambientes padrão para não esquecer nenhum cômodo',
    'Revisão e reordenação de fotos antes da exportação',
    'Estatísticas de progresso em tempo real',
    'Interface otimizada para uso em campo'
  ];

  return (
    <>
      <Helmet>
        <title>PhotoGuide Imóveis - Fotografe imóveis com qualidade profissional</title>
        <meta name="description" content="Sistema de captura guiada para fotografia de imóveis. Organize, capture e exporte fotos profissionais com facilidade." />
      </Helmet>
      <Header />
      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white px-6 py-20 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl" style={{ letterSpacing: '-0.02em' }}>
                  Fotografe imóveis com qualidade profissional
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-muted-foreground max-w-prose">
                  Sistema de captura guiada que garante fotos perfeitas de todos os ambientes. Organize, capture e exporte em minutos.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    to={LOGIN_PATH}
                    className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg"
                  >
                    Começar agora
                  </Link>
                  <Link
                    to="/plans"
                    className="rounded-lg border bg-background px-6 py-3 font-medium hover:bg-muted active:scale-[0.98] transition-all"
                  >
                    Ver planos
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img
                  src="https://images.unsplash.com/photo-1615228100591-976c4e87b179"
                  alt="Fotografia profissional de interior de imóvel moderno com iluminação natural"
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-xl border">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Captura completa</p>
                      <p className="text-xs text-muted-foreground">87 fotos em 12 ambientes</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold sm:text-4xl">Como funciona</h2>
              <p className="mt-3 text-muted-foreground">Três passos simples para fotos profissionais</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-semibold sm:text-4xl mb-6">
                  Recursos que fazem a diferença
                </h2>
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="leading-relaxed">{benefit}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl bg-card p-6 shadow-sm"
                >
                  <Zap className="h-8 w-8 text-primary mb-3" />
                  <p className="text-2xl font-bold mb-1">3x</p>
                  <p className="text-sm text-muted-foreground">Mais rápido que métodos tradicionais</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="rounded-xl bg-card p-6 shadow-sm"
                >
                  <Shield className="h-8 w-8 text-primary mb-3" />
                  <p className="text-2xl font-bold mb-1">100%</p>
                  <p className="text-sm text-muted-foreground">Cobertura de ambientes garantida</p>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold sm:text-4xl mb-4">
              Pronto para começar?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Crie sua conta gratuitamente e comece a fotografar imóveis com qualidade profissional hoje mesmo.
            </p>
            <Link
              to={LOGIN_PATH}
              className="inline-flex rounded-lg bg-primary px-8 py-4 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg"
            >
              Começar agora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}