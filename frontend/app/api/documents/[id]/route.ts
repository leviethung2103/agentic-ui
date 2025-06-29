import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { Document } from '@/types/document';
import mime from 'mime-types';

const metadataPath = path.resolve(process.cwd(), 'data/documents.json');
const uploadsPath = path.resolve(process.cwd(), 'data/user_uploads');

async function readMetadata(): Promise<Document[]> {
  try {
    const data = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const documents = await readMetadata();
    const document = documents.find((doc) => doc.id === id);

    if (!document || document.permission !== 'public') {
        return NextResponse.json({ error: 'Document not found or permission denied' }, { status: 404 });
    }

    const filePath = path.join(uploadsPath, document.path);

    try {
        const fileBuffer = await fs.readFile(filePath);
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';
        
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': mimeType,
                'Content-Disposition': `inline; filename="${document.name}"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
} 