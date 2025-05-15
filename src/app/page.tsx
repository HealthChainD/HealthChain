"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './Home.module.css';

export default function Home() {
  const { publicKey } = useWallet();

  return (
    <div className={styles.container}>      
      <main className={styles.main}>
        <h1 className={styles.title}>HealthChain</h1>        
      </main>
    </div>
  );
}