"use client"
import { useState } from 'react';
import { encryptFile } from '@/app/utils/encryption';
import { uploadToIPFS } from '@/app/utils/ipfs';
import styles from '@/app/components/uploadForm.module.css';
import { useWallet } from '@solana/wallet-adapter-react';

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadForm() {
  const { publicKey } = useWallet();
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedCids, setUploadedCids] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    const newSize = newFiles.reduce((acc, f) => acc + f.size, 0);
    const updatedSize = totalSize + newSize;

    if (updatedSize > MAX_TOTAL_SIZE) {
      alert('Перевищено загальний ліміт розміру файлів (10MB)');
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setTotalSize(updatedSize);
  };

  const handleRemoveFile = (index: number) => {
    const removed = files[index];
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    setTotalSize(totalSize - removed.size);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const saveDocumentToDB = async (cids: string[]) => {
    if (!publicKey || files.length === 0) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: files[0].name, // Беремо назву з першого файлу
          cids,
          owner: publicKey.toString(),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Помилка при збереженні');
      }
      return result;
    } catch (error) {
      console.error('Document save error:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async () => {
    if (!phrase.trim()) {
      alert('Введіть фразу для кодування');
      return;
    }

    if (files.length === 0) {
      alert('Не вибрано жодного файлу');
      return;
    }

    setUploading(true);
    const cids: string[] = [];

    try {
      for (const file of files) {
        const encrypted = await encryptFile(file, phrase);
        const cid = await uploadToIPFS(encrypted, file.name, file.type);
        cids.push(cid);
      }
      await saveDocumentToDB(cids);
      setUploadedCids(cids);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Помилка при завантаженні: ' + (error instanceof Error ? error.message : 'Невідома помилка'));
    } finally {
      setUploading(false);
    }
  };

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
    <div className={styles.uploadContainer}>
      <h2>Завантаження медичних файлів</h2>

      <label className={styles.uploadLabel}>
        Фраза для шифрування:
        <input
          type="text"
          className={styles.uploadInput}
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
          placeholder="Наприклад: my secure key"
        />
      </label>

      <label className={styles.uploadLabel}>
        Додати файли (макс. 10MB):
        <input type="file" multiple onChange={handleFileChange} className={styles.uploadInput} />
      </label>

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li key={index} className={styles.fileItem}>
              <span>
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <button className={styles.removeBtn} onClick={() => handleRemoveFile(index)}>✕</button>
            </li>
          ))}
        </ul>
      )}

      <button
        className={styles.uploadButton}
        onClick={handleUpload}
        disabled={uploading}
      >
        {uploading ? 'Завантаження...' : 'Зашифрувати та завантажити'}
      </button>

      {uploadedCids.length > 0 && (
        <div className={styles.uploadedSection}>
          <h3>CID завантажених файлів:</h3>
          <ul className={styles.cidList}>
            {uploadedCids.map((cid, i) => (
              <li key={i} className={styles.cidItem}>
                <span className={styles.cidText}>{cid}</span>
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(cid, i)}
                >
                  {copiedIndex === i ? 'Скопійовано!' : 'Копіювати CID'}
                </button>
                <a
                  href={`https://ipfs.io/ipfs/${cid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.viewLink}
                >
                  Переглянути
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}