"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [statut, setStatut] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (sessionId) {
      try {
        sessionStorage.removeItem('clodia-cart')
        sessionStorage.removeItem('clodia-point')
        sessionStorage.removeItem('clodia-hopital')
        sessionStorage.removeItem('clodia-batiment')
        sessionStorage.removeItem('clodia-service')
      } catch {}
      setStatut('success')
    } else {
      setStatut('error')
    }
  }, [sessionId])

  if (statut === 'loading') return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: '#9B9B9B' }}>Vérification du paiement...</p>
    </div>
  )

  if (statut === 'error') return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <p style={{ color: '#4D0F1F', fontWeight: 600 }}>Une erreur est survenue.</p>
      <Link href="/commander" style={{ color: '#007FFF', fontSize: '14px' }}>
        Retour à la commande
      </Link>
    </div>
  )

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        width: 72, height: 72, borderRadius: '50%',
        background: '#E8FFF8', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 24px',
      }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00CCCC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{ fontSize: '28px', fontWeight: 600, color: '#1A1A1A', marginBottom: '12px' }}>
        Commande confirmée !
      </h1>
      <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: 1.7, marginBottom: '32px' }}>
        Votre paiement a bien été reçu. Vous recevrez un email de confirmation.
        Votre repas sera déposé dans votre frigidaire avant 12h le jour de la livraison.
      </p>

      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '8px',
        background: '#4D0F1F', color: '#fff',
        fontSize: '14px', fontWeight: 600,
        padding: '15px 32px', borderRadius: '999px',
        textDecoration: 'none',
      }}>
        Retour à l&apos;accueil →
      </Link>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmationContent />
    </Suspense>
  )
}
