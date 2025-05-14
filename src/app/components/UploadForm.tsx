"use client"
import { useState } from 'react';
import { encryptText } from '@/app/utils/encryption';
//import { mintEncryptedNft } from '@/app';

export default function UploadForm() {
  const [text, setText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const encrypted = await encryptText(text);
    await mintEncryptedNft(encrypted);
    alert('Дані завантажено та зашифровано в NFT!');
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <textarea
        rows={6}
        className="border p-2 w-full"
        placeholder="Введіть медичні дані"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Завантажити як NFT
      </button>
    </form>
  );
}
