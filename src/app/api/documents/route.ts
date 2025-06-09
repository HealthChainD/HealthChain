import { NextResponse } from 'next/server';
import connectDB from '@/utils/mongodb';
import Document from '@/models/Documents';


connectDB();


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  
  if (!owner) {
    return NextResponse.json(
      { error: 'Власник документів не вказаний' },
      { status: 400 }
    );
  }

  try {
    const documents = await Document.find({ owner });
    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: 'Помилка сервера при отриманні документів' },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  const { name, cids, owner } = await request.json();

  if (!name || !cids || !owner) {
    return NextResponse.json(
      { error: 'Необхідні поля: name, cids, owner' },
      { status: 400 }
    );
  }

  try {
    const newDocument = new Document({
      name,      
      cids,
      owner,      
    });

    await newDocument.save();
    
    return NextResponse.json({
      success: true,
      document: newDocument
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Помилка сервера при створенні документу' },
      { status: 500 }
    );
  }
}