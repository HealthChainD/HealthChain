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
  const [fileType, setFileType] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDecryptedFile(null);

    try {
      const ipfsGateway = `https://ipfs.io/ipfs/${cid}`;
      
      const headResponse = await fetch(ipfsGateway, { method: 'HEAD' });
      if (!headResponse.ok) throw new Error('Failed to get file metadata');
      
      const contentType = headResponse.headers.get('content-type') || '';
      setFileType(contentType);

      const response = await fetch(ipfsGateway);
      if (!response.ok) throw new Error(`Failed to download file (HTTP ${response.status})`);
      
      const encryptedBlob = await response.blob();
      const decrypted = await decryptFile(encryptedBlob, phrase, contentType);
      
      setDecryptedFile(decrypted);
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
      let extension = '';
      if (fileType.includes('pdf')) extension = '.pdf';
      else if (fileType.includes('jpeg')) extension = '.jpg';
      else if (fileType.includes('png')) extension = '.png';
      
      saveAs(decryptedFile, `${fileName}${extension}`);
    }
  };

  const renderFilePreview = () => {
    if (!decryptedFile) return null;

    const type = decryptedFile.type.split('/')[0];
    const url = URL.createObjectURL(decryptedFile);

    if (fileType.includes('pdf')) {
      return (
        <div className={styles.previewContainer}>
          <iframe 
            src={url}
            className={styles.previewFrame}
            title="Decrypted PDF"
          />
          <button 
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            Download PDF
          </button>
        </div>
      );
    }

    switch (type) {
      case 'image':
        return (
          <div className={styles.previewContainer}>
            <img src={url} alt="Decrypted content" className={styles.previewImage} />
            <button onClick={handleDownload} className={styles.downloadButton}>
              Download Image
            </button>
          </div>
        );
      case 'video':
        return (
          <div className={styles.previewContainer}>
            <video controls src={url} className={styles.previewVideo} />
            <button onClick={handleDownload} className={styles.downloadButton}>
              Download Video
            </button>
          </div>
        );
      case 'audio':
        return (
          <div className={styles.previewContainer}>
            <audio controls src={url} className={styles.previewAudio} />
            <button onClick={handleDownload} className={styles.downloadButton}>
              Download Audio
            </button>
          </div>
        );
      default:
        return (
          <div className={styles.unknownFileType}>
            <p>File successfully decrypted. Type: {decryptedFile.type}</p>
            <button onClick={handleDownload} className={styles.downloadButton}>
              Download File
            </button>
          </div>
        );
    }
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

      {renderFilePreview()}
    </div>
  );
}