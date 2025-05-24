"use client"
import { useState } from 'react';
import { encryptFile } from '@/app/utils/encryption';
import { uploadToIPFS } from '@/app/utils/ipfs';
import styles from '@/app/components/uploadForm.module.css';

const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10 MB

export default function UploadForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [phrase, setPhrase] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedLinks, setUploadedLinks] = useState<{url: string, name: string, type: string}[]>([]);

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
    const links: {url: string, name: string, type: string}[] = [];

    try {
      for (const file of files) {
        const encrypted = await encryptFile(file, phrase);
        const cid = await uploadToIPFS(encrypted, file.name, file.type);
        links.push({
          url: `https://ipfs.io/ipfs/${cid}`,
          name: `${cid}`,
          type: file.type
        });
      }
      setUploadedLinks(links);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Помилка при завантаженні: ' + (error instanceof Error ? error.message : 'Невідома помилка'));
    } finally {
      setUploading(false);
    }
  };

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
                {file.name} ({(file.size / 1024).toFixed(2)} KB) - {file.type}
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

      {uploadedLinks.length > 0 && (
        <div className={styles.uploadedSection}>
          <h3>Посилання на збережені файли:</h3>
          <ul>
            {uploadedLinks.map((item, i) => (
              <li key={i}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.name} ({item.type})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}