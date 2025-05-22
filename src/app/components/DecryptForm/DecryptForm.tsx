"use client";
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { decryptFile } from '@/app/utils/encryption';
import styles from './DecryptForm.module.css';

const FilePreview = ({ file, fileType }: { file: Blob, fileType: string }) => {
  const url = URL.createObjectURL(file);

  
  if (fileType.includes('pdf')) {
    return <iframe src={url} className={styles.previewFrame} title="PDF Preview" />;
  }

  if (fileType.includes('msword') || fileType.includes('wordprocessingml')) {
    return (
      <div className={styles.officePreview}>
        <iframe 
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`} 
          className={styles.previewFrame}
          title="Document Preview"
        />
      </div>
    );
  }

  if (fileType.includes('image')) {
    return <img src={url} alt="Preview" className={styles.previewImage} />;
  }

  return (
    <div className={styles.unsupportedPreview}>
      <p>Перегляд для типу {fileType} не підтримується</p>
      <p>Будь ласка, завантажте файл для перегляду</p>
    </div>
  );
};

export default function DecryptForm() {
  const [cid, setCid] = useState('');
  const [phrase, setPhrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [decryptedFile, setDecryptedFile] = useState<Blob | null>(null);
  const [fileType, setFileType] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const detectFileType = async (cid: string, encryptedBlob: Blob): Promise<string> => {
    try {
      
      const metadataResponse = await fetch(`https://api.pinata.cloud/data/pinList?hashContains=${cid}`, {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`
        }
      });
      
      if (metadataResponse.ok) {
        const metadata = await metadataResponse.json();
        if (metadata.rows && metadata.rows.length > 0) {
          const originalType = metadata.rows[0].metadata?.keyvalues?.originalType;
          if (originalType) {
            console.log('Found file type in Pinata metadata:', originalType);
            return originalType;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to fetch metadata from Pinata:', err);
    }

    
    const cidLower = cid.toLowerCase();
    if (cidLower.endsWith('.pdf')) return 'application/pdf';
    if (cidLower.endsWith('.doc')) return 'application/msword';
    if (cidLower.endsWith('.docx')) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (cidLower.endsWith('.jpg') || cidLower.endsWith('.jpeg')) return 'image/jpeg';
    if (cidLower.endsWith('.png')) return 'image/png';

    
    try {
      const buffer = await encryptedBlob.slice(0, 4).arrayBuffer();
      const view = new DataView(buffer);

      
      if (view.getUint32(0) === 0x25504446) return 'application/pdf';
      
      
      if (view.getUint32(0) === 0x89504E47) return 'image/png';
      
      
      if (view.getUint16(0) === 0xFFD8) return 'image/jpeg';
      
      
      if (view.getUint32(0) === 0xD0CF11E0) return 'application/msword';
      
      
      if (view.getUint32(0) === 0x504B0304) return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } catch (err) {
      console.warn('Failed to detect file type from content:', err);
    }

    
    return 'application/octet-stream';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setDecryptedFile(null);

    try {
      const ipfsGateway = `https://ipfs.io/ipfs/${cid}`;
      const response = await fetch(ipfsGateway);
      
      if (!response.ok) {
        throw new Error(`Не вдалося завантажити файл (HTTP ${response.status})`);
      }

      const encryptedBlob = await response.blob();
      const detectedType = await detectFileType(cid, encryptedBlob);
      console.log('Detected file type:', detectedType);
      
      try {
        const decrypted = await decryptFile(encryptedBlob, phrase, detectedType);
        setDecryptedFile(decrypted);
        setFileType(detectedType);
      } catch (decryptError) {
        console.error('Decryption error:', decryptError);
        throw new Error('Помилка дешифрування. Перевірте правильність кодової фрази.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!decryptedFile) return;

    let extension = '';
    if (fileType.includes('pdf')) extension = '.pdf';
    else if (fileType.includes('msword')) extension = '.doc';
    else if (fileType.includes('wordprocessingml')) extension = '.docx';
    else if (fileType.includes('jpeg')) extension = '.jpg';
    else if (fileType.includes('png')) extension = '.png';
    else extension = '.bin';

    const filename = `decrypted-${cid.slice(0, 8)}${extension}`;
    saveAs(decryptedFile, filename);
  };

  const renderFilePreview = () => {
    if (!decryptedFile) return null;

    return (
      <div className={styles.previewSection}>
        <div className={styles.previewActions}>
          <button 
            onClick={() => setShowPreview(true)}
            className={styles.previewButton}
            disabled={fileType === 'application/octet-stream'}
          >
            Повноекранний перегляд
          </button>
          <button 
            onClick={handleDownload}
            className={styles.downloadButton}
          >
            Завантажити файл
          </button>
        </div>

        <div className={styles.previewContainer}>
          <FilePreview file={decryptedFile} fileType={fileType} />
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Дешифрування файлу</h1>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label htmlFor="cid" className={styles.label}>
            IPFS CID або посилання
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
            Кодова фраза для дешифрування
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
          {isLoading ? 'Дешифрування...' : 'Дешифрувати файл'}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {decryptedFile && renderFilePreview()}

      {showPreview && decryptedFile && (
        <div className={styles.modalOverlay} onClick={() => setShowPreview(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setShowPreview(false)}>
              &times;
            </button>
            <div className={styles.modalPreview}>
              <FilePreview file={decryptedFile} fileType={fileType} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}