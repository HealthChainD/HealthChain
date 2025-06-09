"use client";

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import styles from '@/app/components/uploadForm.module.css';
import { IDocument as Document } from '@/models/Documents';


export default function UserDocuments() {
  const { publicKey } = useWallet();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchDocuments = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/documents?owner=${publicKey.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [publicKey]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!publicKey) {
    return (
      <div className={styles.walletConnectContainer}>
        <div className={styles.walletConnectMessage}>
          Connect your wallet to view your documents
        </div>
      </div>
    );
  }

  return (
    <div className={styles.uploadContainer}>
      <h2>Your Medical Documents</h2>
      
      <div className={styles.uploadedSection}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Document History</h3>
          <button 
            onClick={fetchDocuments}
            className={styles.copyButton}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        {documents.length === 0 ? (
          <p>No documents found</p>
        ) : (
          <ul className={styles.cidList}>
            {documents.map((doc, docIndex) => (
              <li key={doc._id} className={styles.fileItem}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Name:</strong> {doc.name}
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Uploaded:</strong> {formatDate(doc.createdAt)}
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>Files:</strong>
                  <ul style={{ marginTop: '0.5rem' }}>
                    {doc.cids.map((cid, cidIndex) => {
                      const uniqueIndex = docIndex * 100 + cidIndex;
                      return (
                        <li key={cid} style={{ marginBottom: '0.5rem' }}>
                          <div className={styles.cidItem}>
                            <span className={styles.cidText}>{cid}</span>
                            <button
                              className={styles.copyButton}
                              onClick={() => copyToClipboard(cid, uniqueIndex)}
                            >
                              {copiedIndex === uniqueIndex ? 'Copied!' : 'Copy CID'}
                            </button>
                            <a
                              href={`https://ipfs.io/ipfs/${cid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.viewLink}
                            >
                              View
                            </a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}