"use client";
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">HealthChain</h1>
      <WalletMultiButton />
      {publicKey && (
        <a href="/upload" className="mt-6 text-blue-500 underline">
          Перейти до завантаження медичних даних
        </a>
      )}
    </main>
  );
}
