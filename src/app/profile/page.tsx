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

const mockPatientInfo = {
  fullName: 'Іваненко Марія Петрівна',
  dateOfBirth: '1990-05-15',
  gender: 'Жіноча',
  bloodType: 'A(II) Rh+',
  contact: {
    phone: '+380501234567',
    email: 'maria.ivanenko@email.com',
    address: 'м. Київ, вул. Шевченка, 10, кв. 25'
  },
  medicalInfo: {
    chronicDiseases: ['Гіпертонія', 'Цукровий діабет 2 типу'],
    allergies: ['Пеніцилін', 'Пилок берези'],
    height: 165,
    weight: 58,
    lastCheckup: '2024-02-20'
  }
};

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
  const [activeTab, setActiveTab] = useState('personal');

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
          className={`${styles.tab} ${activeTab === 'personal' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          Особиста інформація
        </button>
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
        {activeTab === 'personal' ? (
          <div className={styles.personalInfo}>
            <div className={styles.personalInfoSection}>
              <h2>Основна інформація</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>ПІБ:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.fullName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Дата народження:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.dateOfBirth}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Стать:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.gender}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Група крові:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.bloodType}</span>
                </div>
              </div>
            </div>

            <div className={styles.personalInfoSection}>
              <h2>Контактна інформація</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Телефон:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Адреса:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.address}</span>
                </div>
              </div>
            </div>

            <div className={styles.personalInfoSection}>
              <h2>Медична інформація</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Хронічні захворювання:</span>
                  <span className={styles.infoValue}>
                    {mockPatientInfo.medicalInfo.chronicDiseases.join(', ')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Алергії:</span>
                  <span className={styles.infoValue}>
                    {mockPatientInfo.medicalInfo.allergies.join(', ')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Зріст:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.medicalInfo.height} см</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Вага:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.medicalInfo.weight} кг</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Останній огляд:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.medicalInfo.lastCheckup}</span>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'documents' ? (
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