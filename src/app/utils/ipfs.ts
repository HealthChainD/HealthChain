export async function uploadToIPFS(file: Blob, filename: string, fileType: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', file, filename);
  formData.append('filename', filename);
  formData.append('fileType', fileType);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Upload to IPFS failed');
  }

  const { cid } = await res.json();
  return cid;
}