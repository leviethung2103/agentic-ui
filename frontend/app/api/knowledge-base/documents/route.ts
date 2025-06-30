import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { Document } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@/auth';

const metadataPath = path.resolve(process.cwd(), 'data/documents.json');

async function readMetadata(): Promise<Document[]> {
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data) as Document[];
  } catch (error: any) {
    // If the file doesn't exist, return an empty array
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function GET() {
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const documents = await readMetadata();
  const userDocuments = documents.filter((doc) => doc.userId === session.user.id);

  return NextResponse.json(userDocuments);
}
