import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useSubscriptionAuth } from '@/contexts/SubscriptionAuthContext.jsx';
import { activeSubscription } from '@/lib/ecommerceSubscriptionsUtils';
import ManageSubscriptionButton from './ManageSubscriptionButton.jsx';
import { LOGIN_PATH, PLANS_PATH, MANAGE_PATH } from '@/config/subscriptionRoutes.js';

export default function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const { subscriptions } = useSubscriptionAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const active = activeSubscription(subscriptions);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold text-primary">
          <Camera className="h-6 w-6" />
          <span>PhotoGuide Imóveis</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="font-medium text-foreground hover:text-primary transition-colors">
                Dashboard
              </Link>
              <Link to={PLANS_PATH} className="font-medium text-foreground hover:text-primary transition-colors">
                Planos
              </Link>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 font-medium hover:bg-muted/80 transition-all"
                >
                  <User className="h-4 w-4" />
                  <span>{currentUser?.name || currentUser?.email}</span>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border bg-card shadow-lg">
                    <div className="p-2">
                      {active && (
                        <div className="mb-2 rounded-md bg-primary/10 px-3 py-2">
                          <p className="text-xs font-medium text-primary uppercase tracking-wide">
                            {active.status === 'trialing' ? 'Período de teste' : 'Plano ativo'}
                          </p>
                          <p className="text-sm font-semibold text-foreground">{active.product_title}</p>
                        </div>
                      )}
                      <Link
                        to={MANAGE_PATH}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        Assinatura
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to={PLANS_PATH} className="font-medium text-foreground hover:text-primary transition-colors">
                Planos
              </Link>
              <Link
                to={LOGIN_PATH}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-all"
              >
                Entrar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden rounded-lg p-2 hover:bg-muted transition-colors"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t bg-white px-6 py-4 md:hidden">
          {isAuthenticated ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                className="rounded-lg px-4 py-2 font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to={PLANS_PATH}
                className="rounded-lg px-4 py-2 font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                to={MANAGE_PATH}
                className="rounded-lg px-4 py-2 font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assinatura
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg px-4 py-2 font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
              >
                Sair
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to={PLANS_PATH}
                className="rounded-lg px-4 py-2 font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Planos
              </Link>
              <Link
                to={LOGIN_PATH}
                className="rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground text-center hover:bg-primary/90 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}