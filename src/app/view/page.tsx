"use client";
import { useState } from 'react';
import { saveAs } from 'file-saver';
import { decryptFile } from '../utils/encryption';

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
      if (!headResponse.ok) throw new Error('Не вдалося отримати метадані файлу');
      
      const contentType = headResponse.headers.get('content-type') || '';
      setFileType(contentType);

      
      const response = await fetch(ipfsGateway);
      if (!response.ok) throw new Error(`Не вдалося завантажити файл (HTTP ${response.status})`);
      
      const encryptedBlob = await response.blob();
      const decrypted = await decryptFile(encryptedBlob, phrase, contentType);
      
      setDecryptedFile(decrypted);
      setFileName(`decrypted-${cid.slice(0, 8)}`);
    } catch (err) {
      console.error('Decryption error:', err);
      setError(err instanceof Error ? err.message : 'Сталася невідома помилка');
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
        <div className="mt-4">
          <iframe 
            src={url}
            className="w-full h-96 border"
            title="Decrypted PDF"
          />
          <button 
            onClick={handleDownload}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Завантажити PDF
          </button>
        </div>
      );
    }

    switch (type) {
      case 'image':
        return <img src={url} alt="Decrypted content" className="max-w-full max-h-96 mt-4" />;
      case 'video':
        return <video controls src={url} className="max-w-full max-h-96 mt-4" />;
      case 'audio':
        return <audio controls src={url} className="mt-4" />;
      case 'text':
      case 'application': 
        return (
          <iframe 
            src={url} 
            className="w-full h-96 mt-4 border"
            title="Decrypted document"
          />
        );
      default:
        return (
          <div className="mt-4 p-4 border rounded">
            <p>Файл успішно дешифровано. Тип: {decryptedFile.type}</p>
            <button 
              onClick={handleDownload}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Завантажити файл
            </button>
          </div>
        );
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Дешифрування файлу</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cid" className="block text-sm font-medium text-gray-700">
            IPFS CID (посилання)
          </label>
          <input
            id="cid"
            type="text"
            value={cid}
            onChange={(e) => setCid(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="phrase" className="block text-sm font-medium text-gray-700">
            Кодова фраза для дешифрування
          </label>
          <input
            id="phrase"
            type="password"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Дешифрування...' : 'Дешифрувати файл'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {renderFilePreview()}
    </div>
  );
}