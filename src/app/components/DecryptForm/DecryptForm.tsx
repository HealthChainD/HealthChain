"use client";
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { decryptFile } from '@/app/utils/encryption';
import styles from './DecryptForm.module.css';

export default function DecryptForm() {
  const [cid, setCid] = useState('');
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('application/pdf'); 
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDecryptedFile(null);

    try {
      const ipfsGateway = `https://ipfs.io/ipfs/${cid}`;      
      
      let detectedType = 'application/pdf';
      if (cid.toLowerCase().endsWith('.jpg') || cid.toLowerCase().endsWith('.jpeg')) {
        detectedType = 'image/jpeg';
      } else if (cid.toLowerCase().endsWith('.png')) {
        detectedType = 'image/png';
      }

      const response = await fetch(ipfsGateway);
      if (!response.ok) throw new Error(`Failed to download file (HTTP ${response.status})`);
      
      const encryptedBlob = await response.blob();
      const decrypted = await decryptFile(encryptedBlob, phrase, detectedType);
      
      setDecryptedFile(decrypted);
      setFileType(detectedType);
      setFileName(`decrypted-${cid.slice(0, 8)}`);
    } catch (err) {
      console.error('Decryption error:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (decryptedFile) {
      let extension = '.pdf'; 
      if (fileType.includes('jpeg')) extension = '.jpg';
      else if (fileType.includes('png')) extension = '.png';
      
      saveAs(decryptedFile, `${fileName}${extension}`);
    }
  };

  const renderFilePreview = () => {
    if (!decryptedFile) return null;

    const url = URL.createObjectURL(decryptedFile);

    return (
      <div className={styles.previewSection}>
        <div className={styles.previewActions}>
          <button 
            onClick={() => setShowPreview(true)}
            className={styles.previewButton}
          >
            View Fullscreen
          </button>
          <button 
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            Download PDF
          </button>
        </div>

        <iframe 
          src={url}
          className={styles.previewFrame}
          title="Decrypted Document"
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>File Decryption</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="cid" className={styles.label}>
            IPFS CID (Link)
          </label>
          <input
            id="cid"
            type="text"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className={styles.input}
            required
            placeholder="Qmc71kpfMgcShAJvi828P83p8BKSKNGCNoAWwgD6Dx83bD"
          />
        </div>

        <div>
          <label htmlFor="phrase" className={styles.label}>
            Decryption Passphrase
          </label>
          <input
            id="phrase"
            type="password"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? 'Decrypting...' : 'Decrypt File'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {decryptedFile && renderFilePreview()}
    </div>
  );
}