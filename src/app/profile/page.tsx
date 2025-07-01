"use client";
import { useWallet } from '@solana/wallet-adapter-react';
import styles from './Profile.module.css';
import { useState } from 'react';

const mockDocuments = [
  {
    id: 1,
    name: 'Blood Test Results',
    date: '2024-03-15',
    type: 'application/pdf',
    cid: 'QmX123456789abcdef',
    doctor: 'Dr. Petro O.V.'
  },
  {
    id: 2,
    name: 'Chest X-Ray',
    date: '2024-03-10',
    type: 'image/jpeg',
    cid: 'QmY987654321fedcba',
    doctor: 'Dr. Kovalenko I.M.'
  },
  {
    id: 3,
    name: 'Cardiologist Consultation',
    date: '2024-03-05',
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    cid: 'QmZ456789123abcdef',
    doctor: 'Dr. Sydorenko P.I.'
  }
];

const mockPatientInfo = {
  fullName: 'Maria Ivanenko',
  dateOfBirth: '1990-05-15',
  gender: 'Female',
  bloodType: 'A(II) Rh+',
  contact: {
    phone: '+380501234567',
    email: 'maria.ivanenko@email.com',
    address: 'Kyiv, Shevchenko St. 10, Apt. 25'
  },
  medicalInfo: {
    chronicDiseases: ['Hypertension', 'Type 2 Diabetes'],
    allergies: ['Penicillin', 'Birch Pollen'],
    height: 165,
    weight: 58,
    lastCheckup: '2024-02-20'
  }
};

const mockDoctors = [
  {
    id: 1,
    name: 'Dr. Petro Oleksandr',
    specialization: 'Therapist',
    contact: '+380501234567',
    email: 'petro@healthchain.com'
  },
  {
    id: 2,
    name: 'Dr. Kovalenko Iryna',
    specialization: 'Radiologist',
    contact: '+380672345678',
    email: 'kovalenko@healthchain.com'
  },
  {
    id: 3,
    name: 'Dr. Sydorenko Petro',
    specialization: 'Cardiologist',
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
        <h1>Personal Account</h1>
        <div className={styles.walletInfo}>
          <span>Your wallet:</span>
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
          Personal Information
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'documents' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          My Documents
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'doctors' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('doctors')}
        >
          Doctor Contacts
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === 'personal' ? (
          <div className={styles.personalInfo}>
            <div className={styles.personalInfoSection}>
              <h2>Basic Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Full Name:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.fullName}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Date of Birth:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.dateOfBirth}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Gender:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.gender}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Blood Type:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.bloodType}</span>
                </div>
              </div>
            </div>

            <div className={styles.personalInfoSection}>
              <h2>Contact Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Phone:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.phone}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Email:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.email}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Address:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.contact.address}</span>
                </div>
              </div>
            </div>

            <div className={styles.personalInfoSection}>
              <h2>Medical Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Chronic Diseases:</span>
                  <span className={styles.infoValue}>
                    {mockPatientInfo.medicalInfo.chronicDiseases.join(', ')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Allergies:</span>
                  <span className={styles.infoValue}>
                    {mockPatientInfo.medicalInfo.allergies.join(', ')}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Height:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.medicalInfo.height} cm</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Weight:</span>
                  <span className={styles.infoValue}>{mockPatientInfo.medicalInfo.weight} kg</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Last Checkup:</span>
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
                    <span>Date: {doc.date}</span>
                    <span>Doctor: {doc.doctor}</span>
                  </p>
                  <p className={styles.documentCid}>CID: {doc.cid}</p>
                </div>
                <div className={styles.documentActions}>
                  <button className={styles.viewButton}>View</button>
                  <button className={styles.downloadButton}>Download</button>
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
                      <span className={styles.contactLabel}>Phone:</span>
                      <a href={`tel:${doctor.contact}`}>{doctor.contact}</a>
                    </p>
                    <p>
                      <span className={styles.contactLabel}>Email:</span>
                      <a href={`mailto:${doctor.email}`}>{doctor.email}</a>
                    </p>
                  </div>
                </div>
                <button className={styles.contactButton}>Contact</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 