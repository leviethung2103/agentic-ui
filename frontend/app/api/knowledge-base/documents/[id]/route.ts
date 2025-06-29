import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import path from 'path';
import fs from 'fs/promises';
import { Document } from '@/types/document';

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

async function writeMetadata(data: Document[]): Promise<void> {
  await fs.writeFile(metadataPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { permission } = await req.json();

  if (!['public', 'private'].includes(permission)) {
    return NextResponse.json({ error: 'Invalid permission value' }, { status: 400 });
  }

  const documents = await readMetadata();
  const docIndex = documents.findIndex((doc) => doc.id === id && doc.userId === session.user.id);

  if (docIndex === -1) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  documents[docIndex].permission = permission;
  await writeMetadata(documents);

  return NextResponse.json(documents[docIndex]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const documents = await readMetadata();
    const docIndex = documents.findIndex((doc) => doc.id === id && doc.userId === session.user.id);

    if (docIndex === -1) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const docToDelete = documents[docIndex];
    const filePath = path.join(uploadsPath, docToDelete.path);

    // Delete file from filesystem
    try {
        await fs.unlink(filePath);
    } catch (error: any) {
        // Log error but proceed to remove metadata
        console.error(`Failed to delete file: ${filePath}`, error);
    }

    // Remove from metadata
    documents.splice(docIndex, 1);
    await writeMetadata(documents);

    return NextResponse.json({ message: 'Document deleted successfully' });
} 