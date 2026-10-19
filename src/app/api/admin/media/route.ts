import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { getMediaAssets, getMediaAssetsAsync, saveMediaAssetAsync, deleteMediaAssetAsync, addAuditLogAsync } from '@/lib/cms/db';
import { getCurrentAdminUser, hasPermission } from '@/lib/cms/auth';

export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get('folder') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const assets = (await getMediaAssetsAsync({ folder, tag })) || getMediaAssets({ folder, tag });
  return NextResponse.json({ success: true, data: assets });
}

export async function POST(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'CONTENT_EDITOR', 'MEDIA_MANAGER'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle Multipart Form Data (File Upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const alt = (formData.get('alt') as string) || '';
      const caption = (formData.get('caption') as string) || '';
      const folder = (formData.get('folder') as string) || 'uploads';

      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'application/pdf', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not supported. Please upload an image, video, or PDF.` },
          { status: 400 }
        );
      }

      // Validate file size (max 25MB)
      if (file.size > 25 * 1024 * 1024) {
        return NextResponse.json({ error: 'File size exceeds maximum 25MB limit' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Safe clean filename
      const ext = path.extname(file.name) || '.jpg';
      const baseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFilename = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(UPLOAD_DIR, uniqueFilename);

      let publicUrl = `/uploads/${uniqueFilename}`;

      // Upload directly to Vercel Blob if token is available
      if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
          const { put } = await import('@vercel/blob');
          const blob = await put(`media/${uniqueFilename}`, buffer, {
            access: 'public',
            contentType: file.type,
            addRandomSuffix: false,
          });
          publicUrl = blob.url;
        } catch (blobErr) {
          console.warn('Vercel Blob direct media upload notice:', blobErr);
        }
      }

      // Also attempt local disk write if not on read-only system
      if (!publicUrl.startsWith('http')) {
        try {
          ensureUploadDir();
          fs.writeFileSync(filePath, buffer);
        } catch {
          publicUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
        }
      }

      const saved = await saveMediaAssetAsync({
        filename: uniqueFilename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: publicUrl,
        alt: alt || baseName,
        caption: caption,
        folder: folder,
      });

      await addAuditLogAsync({
        userId: user.id,
        userName: user.name,
        action: 'UPLOAD_MEDIA',
        entityType: 'MEDIA',
        entityId: saved.id,
        details: `Uploaded file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      });

      try {
        revalidatePath('/', 'layout');
      } catch {}

      return NextResponse.json(saved);
    }

    // Handle JSON payload (e.g. metadata update or external URL entry)
    const body = await req.json();
    if (!body.url || !body.filename) {
      return NextResponse.json({ error: 'URL and filename are required' }, { status: 400 });
    }

    const saved = await saveMediaAssetAsync(body);
    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'UPDATE_MEDIA_METADATA',
      entityType: 'MEDIA',
      entityId: saved.id,
      details: `Saved media metadata: "${saved.alt || saved.filename}"`,
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json(saved);
  } catch (err: any) {
    console.error('Media upload error:', err);
    return NextResponse.json({ error: err.message || 'Failed to save media' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const user = await getCurrentAdminUser();
  if (!user || !hasPermission(user.role, ['SUPER_ADMIN', 'MEDIA_MANAGER'])) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 });
    }

    await deleteMediaAssetAsync(id);

    await addAuditLogAsync({
      userId: user.id,
      userName: user.name,
      action: 'DELETE_MEDIA',
      entityType: 'MEDIA',
      entityId: id,
      details: `Deleted media asset with ID: ${id}`,
    });

    try {
      revalidatePath('/', 'layout');
    } catch {}

    return NextResponse.json({ success: true, message: 'Media deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete media' }, { status: 500 });
  }
}
