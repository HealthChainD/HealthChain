"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navbarBrand}>
        HealthChain
      </Link>
      
      <button 
        className={styles.mobileMenuButton}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className={styles.mobileMenuIcon}></span>
      </button>

      <div className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <Link 
          href="/upload" 
          className={`${styles.navLink} ${pathname === '/upload' ? styles.activeNavLink : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Upload
        </Link>
        <Link 
          href="/view" 
          className={`${styles.navLink} ${pathname === '/view' ? styles.activeNavLink : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Decrypt
        </Link>
        <Link 
          href="/profile" 
          className={`${styles.navLink} ${pathname === '/profile' ? styles.activeNavLink : ''}`}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Профіль
        </Link>
        <WalletMultiButton className={styles.walletButton} />
      </div>
    </nav>
  );
}