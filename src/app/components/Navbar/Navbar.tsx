"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbarBrand}>
        HealthChain
      </Link>
      <div className={styles.navLinks}>
        <Link 
          href="/upload" 
          className={`${styles.navLink} ${pathname === '/upload' ? styles.activeNavLink : ''}`}
        >
          Upload
        </Link>
        <Link 
          href="/view" 
          className={`${styles.navLink} ${pathname === '/view' ? styles.activeNavLink : ''}`}
        >
          Decrypt
        </Link>
        <WalletMultiButton className={styles.walletButton} />
      </div>
    </nav>
  );
}