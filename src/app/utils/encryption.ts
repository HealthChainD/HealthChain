export async function encryptFile(file: File, phrase: string): Promise<Blob> {
  try {
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(phrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100_000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    const fileBuffer = await file.arrayBuffer();
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      fileBuffer
    );

    
    const metadata = {
      originalType: file.type,
      originalName: file.name
    };

    
    const metadataStr = JSON.stringify(metadata);
    const metadataBuffer = new TextEncoder().encode(metadataStr);
    const metadataLength = new Uint32Array([metadataBuffer.length]);
    
    console.log('Encryption metadata:', {
      metadataStr,
      metadataLength: metadataLength[0],
      saltLength: salt.length,
      ivLength: iv.length,
      encryptedLength: encrypted.byteLength
    });

    
    const totalLength = 4 + metadataBuffer.length + salt.length + iv.length + encrypted.byteLength;
    const resultBuffer = new ArrayBuffer(totalLength);
    const resultView = new DataView(resultBuffer);
    
    
    resultView.setUint32(0, metadataBuffer.length);
    
    
    const resultArray = new Uint8Array(resultBuffer);
    resultArray.set(new Uint8Array(metadataBuffer), 4);
    
    
    resultArray.set(salt, 4 + metadataBuffer.length);
    
    
    resultArray.set(iv, 4 + metadataBuffer.length + salt.length);
    
   
    resultArray.set(new Uint8Array(encrypted), 4 + metadataBuffer.length + salt.length + iv.length);

    return new Blob([resultBuffer], { type: 'application/octet-stream' });
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt file');
  }
}

export async function decryptFile(encryptedBlob: Blob, phrase: string, fileType: string): Promise<Blob> {
  try {
    const buffer = await encryptedBlob.arrayBuffer();
    const view = new DataView(buffer);
    
    
    const metadataLength = view.getUint32(0);
    console.log('Metadata length:', metadataLength);
    console.log('Total buffer length:', buffer.byteLength);
    
    
    const metadataBuffer = buffer.slice(4, 4 + metadataLength);
    let metadata;
    try {
      metadata = JSON.parse(new TextDecoder().decode(metadataBuffer));
      console.log('Parsed metadata:', metadata);
    } catch (error) {
      console.warn('Failed to parse metadata, using provided file type');
      metadata = { originalType: fileType };
    }
    
    
    const finalFileType = metadata.originalType || fileType;
    console.log('Final file type:', finalFileType);
    
    
    const saltOffset = 4 + metadataLength;
    const ivOffset = saltOffset + 16;
    const dataOffset = ivOffset + 12;
    
    console.log('Offsets:', {
      saltOffset,
      ivOffset,
      dataOffset,
      totalLength: buffer.byteLength
    });
    
        if (dataOffset >= buffer.byteLength) {
      console.error('Invalid data format:', {
        dataOffset,
        bufferLength: buffer.byteLength,
        metadataLength,
        saltLength: 16,
        ivLength: 12
      });
      throw new Error('Invalid encrypted data format: insufficient data');
    }
    
    const salt = buffer.slice(saltOffset, ivOffset);
    const iv = buffer.slice(ivOffset, dataOffset);
    const encryptedData = buffer.slice(dataOffset);
    
    console.log('Data lengths:', {
      salt: salt.byteLength,
      iv: iv.byteLength,
      encryptedData: encryptedData.byteLength
    });

    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(phrase),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100_000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedData
    );

    return new Blob([decrypted], { type: finalFileType });
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt file. Please check your passphrase.');
  }
}