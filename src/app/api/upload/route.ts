import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const form = await req.formData();
        const file = form.get('file') as Blob | null;
        const filename = form.get('filename') as string;
        const fileType = form.get('fileType') as string;

        if (!file || !filename) {
            return NextResponse.json({ error: 'Missing file or filename' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const blob = new Blob([buffer], { type: fileType });

        const pinataFormData = new FormData();
        pinataFormData.append('file', blob, filename);
        
      
        const metadata = {
            name: filename,
            keyvalues: {
                originalType: fileType,
                originalName: filename
            }
        };
        
        pinataFormData.append('pinataMetadata', JSON.stringify(metadata));

        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
            },
            body: pinataFormData as any,
        });

        const result = await response.json();

        if (!response.ok) {
            return NextResponse.json({ error: result.error || 'Upload failed' }, { status: 500 });
        }

        return NextResponse.json({ 
            cid: result.IpfsHash,
            originalType: fileType,
            originalName: filename
        });
    } catch (err: any) {
        console.error('UPLOAD ERROR:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}