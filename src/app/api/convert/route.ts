import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const targetFormat = formData.get('targetFormat') as string;

    if (!file || !targetFormat) {
      return NextResponse.json(
        { error: 'File and target format are required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let processedImage;

    switch (targetFormat.toLowerCase()) {
      case 'jpeg':
      case 'jpg':
        processedImage = await sharp(buffer).jpeg().toBuffer();
        break;
      case 'png':
        processedImage = await sharp(buffer).png().toBuffer();
        break;
      case 'webp':
        processedImage = await sharp(buffer).webp().toBuffer();
        break;
      case 'avif':
        processedImage = await sharp(buffer).avif().toBuffer();
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    const newFileName = `${fileName}.${targetFormat.toLowerCase()}`;

    return new NextResponse(processedImage, {
      headers: {
        'Content-Type': `image/${targetFormat.toLowerCase()}`,
        'Content-Disposition': `attachment; filename="${newFileName}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
} 