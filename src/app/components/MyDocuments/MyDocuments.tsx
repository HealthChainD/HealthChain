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
  const [shareAddresses, setShareAddresses] = useState<{ [key: string]: string }>({});
  const [shareStatus, setShareStatus] = useState<{ [key: string]: string }>({});

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

  const handleShareAccess = async (documentId: string) => {
    const address = shareAddresses[documentId];
    if (!address) return;

    try {
      
      const mockTransaction = {
        from: publicKey?.toString(),
        to: address,
        type: 'ACCESS_GRANT',
        documentId: documentId,
        timestamp: new Date().toISOString()
      };

      
      console.log('Sending notification transaction:', mockTransaction);
      
     
      await new Promise(resolve => setTimeout(resolve, 1000));

      setShareStatus(prev => ({
        ...prev,
        [documentId]: 'Access granted and notification sent successfully!'
      }));

      setShareAddresses(prev => ({
        ...prev,
        [documentId]: ''
      }));

      setTimeout(() => {
        setShareStatus(prev => ({
          ...prev,
          [documentId]: ''
        }));
      }, 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setShareStatus(prev => ({
        ...prev,
        [documentId]: 'Error sending notification. Please try again.'
      }));
    }
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
                  <strong>Share Access:</strong>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Enter Solana wallet address"
                      value={shareAddresses[doc._id] || ''}
                      onChange={(e) => setShareAddresses(prev => ({
                        ...prev,
                        [doc._id]: e.target.value
                      }))}
                      className={styles.input}
                    />
                    <button
                      onClick={() => handleShareAccess(doc._id)}
                      className={styles.copyButton}
                      disabled={!shareAddresses[doc._id]}
                    >
                      Share
                    </button>
                  </div>
                  {shareStatus[doc._id] && (
                    <div style={{ color: 'green', marginTop: '0.5rem' }}>
                      {shareStatus[doc._id]}
                    </div>
                  )}
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