import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import path from 'path';
import fs from 'fs/promises';
import { Document } from '@/types/document';
import { v4 as uuidv4 } from 'uuid';

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

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const userUploadsPath = path.join(uploadsPath, session.user.id);
    await fs.mkdir(userUploadsPath, { recursive: true });

    const documents: Document[] = await readMetadata();
    const newDocuments: Document[] = [];

    for (const file of files) {
      if (!(file instanceof File)) continue;
      const fileId = uuidv4();
      const fileExtension = path.extname(file.name);
      const newFileName = `${fileId}${fileExtension}`;
      const filePath = path.join(userUploadsPath, newFileName);
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, fileBuffer);
      const newDocument: Document = {
        id: fileId,
        name: file.name,
        path: path.join(session.user.id, newFileName),
        userId: session.user.id,
        ownerName: session.user.name || '',
        size: file.size,
        permission: 'private',
        createdAt: new Date().toISOString(),
      };
      documents.push(newDocument);
      newDocuments.push(newDocument);
    }
    await writeMetadata(documents);
    return NextResponse.json(newDocuments.length === 1 ? newDocuments[0] : newDocuments);
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Internal server error' }, { status: 500 });
  }
} 