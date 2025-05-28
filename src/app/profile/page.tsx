"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './Profile.module.css';
import { useState } from 'react';


const mockDocuments = [
  {
    id: 1,
    name: 'Результати аналізів крові',
    date: '2024-03-15',
    type: 'application/pdf',
    cid: 'QmX123456789abcdef',
    doctor: 'Др. Петренко О.В.'
  },
  {
    id: 2,
    name: 'Рентген легенів',
    date: '2024-03-10',
    type: 'image/jpeg',
    cid: 'QmY987654321fedcba',
    doctor: 'Др. Коваленко І.М.'
  },
  {
    id: 3,
    name: 'Консультація кардіолога',
    date: '2024-03-05',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    cid: 'QmZ456789123abcdef',
    doctor: 'Др. Сидоренко П.І.'
  }
];


const mockDoctors = [
  {
    id: 1,
    name: 'Др. Петренко Олександр Володимирович',
    specialization: 'Терапевт',
    contact: '+380501234567',
    email: 'petrenko@healthchain.com'
  },
  {
    id: 2,
    name: 'Др. Коваленко Ірина Миколаївна',
    specialization: 'Рентгенолог',
    contact: '+380672345678',
    email: 'kovalenko@healthchain.com'
  },
  {
    id: 3,
    name: 'Др. Сидоренко Петро Іванович',
    specialization: 'Кардіолог',
    contact: '+380633456789',
    email: 'sydorenko@healthchain.com'
  }
];

export default function Profile() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState('documents');

  if (!publicKey) {
    return (
      <div className={styles.walletConnectContainer}>
        <div className={styles.walletConnectMessage}>
          Connect your wallet to use this page
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Особистий кабінет</h1>
        <div className={styles.walletInfo}>
          <span>Ваш гаманець:</span>
          <span className={styles.walletAddress}>
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Мої документи
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'doctors' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Контакти лікарів
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'documents' ? (
          <div className={styles.documentsList}>
            {mockDocuments.map((doc) => (
              <div key={doc.id} className={styles.documentCard}>
                <div className={styles.documentInfo}>
                  <h3>{doc.name}</h3>
                  <p className={styles.documentMeta}>
                    <span>Дата: {doc.date}</span>
                    <span>Лікар: {doc.doctor}</span>
                  </p>
                  <p className={styles.documentCid}>CID: {doc.cid}</p>
                </div>
                <div className={styles.documentActions}>
                  <button className={styles.viewButton}>Переглянути</button>
                  <button className={styles.downloadButton}>Завантажити</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.doctorsList}>
            {mockDoctors.map((doctor) => (
              <div key={doctor.id} className={styles.doctorCard}>
                <div className={styles.doctorInfo}>
                  <h3>{doctor.name}</h3>
                  <p className={styles.doctorSpecialization}>{doctor.specialization}</p>
                  <div className={styles.doctorContacts}>
                    <p>
                      <span className={styles.contactLabel}>Телефон:</span>
                      <a href={`tel:${doctor.contact}`}>{doctor.contact}</a>
                    </p>
                    <p>
                      <span className={styles.contactLabel}>Email:</span>
                      <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                    </p>
                  </div>
                </div>
                <button className={styles.contactButton}>Написати</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 