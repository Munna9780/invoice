import { saveAs } from 'file-saver';
import { PDFDocument } from 'pdf-lib';
import { Document, Packer, Paragraph } from 'docx';
import * as XLSX from 'xlsx';
import sharp from 'sharp';

// PDF Conversions
export const convertPDFToDocx = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pages = pdfDoc.getPages();
  
  // Create a new Word document
  const doc = new Document({
    sections: [{
      properties: {},
      children: pages.map((page) => {
        // Extract text content using textContent property
        const textContent = page.getTextContent?.() || '';
        return new Paragraph({ text: textContent.toString() });
      })
    }]
  });

  // Generate and return the DOCX file
  const docxBlob = await Packer.toBlob(doc);
  return docxBlob;
};

export const convertDocxToPDF = async (file: File): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  
  // Add text from DOCX (simplified version)
  const text = new TextDecoder().decode(arrayBuffer);
  const lines = text.split('\n');
  let yOffset = page.getHeight() - 50;
  
  for (const line of lines) {
    if (yOffset > 50) { // Ensure we don't write below the page
      page.drawText(line, {
        x: 50,
        y: yOffset,
        size: 12,
      });
      yOffset -= 15; // Move down for next line
    }
  }
  
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
};

// Image Conversions
export const convertImage = async (file: File, targetFormat: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const image = sharp(new Uint8Array(arrayBuffer));

  let convertedBuffer: Buffer;
  const options = { quality: 90 }; // Default quality setting

  switch (targetFormat.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
      convertedBuffer = await image.jpeg(options).toBuffer();
      break;
    case 'png':
      convertedBuffer = await image.png().toBuffer();
      break;
    case 'webp':
      convertedBuffer = await image.webp(options).toBuffer();
      break;
    case 'gif':
      convertedBuffer = await image.gif().toBuffer();
      break;
    default:
      throw new Error('Unsupported format');
  }

  return new Blob([convertedBuffer], { type: `image/${targetFormat}` });
};

// Audio Conversions
export const convertAudio = async (file: File, targetFormat: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Decode the audio file
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
  // Create a new audio buffer for the converted format
  const offlineContext = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  
  const source = offlineContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineContext.destination);
  source.start();
  
  // Render the audio
  const renderedBuffer = await offlineContext.startRendering();
  
  // Create a media stream from the audio buffer
  const mediaStream = new MediaStream();
  const audioTrack = new MediaStreamAudioSourceNode(audioContext, {
    mediaStream: new MediaStream([createAudioTrack(renderedBuffer)])
  });
  
  // Set up media recorder with proper MIME type
  const mimeType = getMimeType(targetFormat);
  const mediaRecorder = new MediaRecorder(mediaStream, {
    mimeType,
    audioBitsPerSecond: 128000 // 128kbps
  });
  
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      resolve(blob);
    };
    
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), (audioBuffer.duration * 1000) + 100);
  });
};

// Video Conversions
export const convertVideo = async (file: File, targetFormat: string): Promise<Blob> => {
  const videoElement = document.createElement('video');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d')!;
  
  // Set up video element
  videoElement.src = URL.createObjectURL(file);
  await new Promise((resolve) => {
    videoElement.onloadedmetadata = resolve;
  });
  
  // Set canvas dimensions
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  // Set up media recorder with proper MIME type
  const mimeType = getMimeType(targetFormat);
  const stream = canvas.captureStream();
  
  // Add audio track if present in the original video
  if (videoElement.captureStream) {
    const audioTracks = videoElement.captureStream().getAudioTracks();
    if (audioTracks.length > 0) {
      stream.addTrack(audioTracks[0]);
    }
  }
  
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2500000 // 2.5 Mbps
  });
  
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    let frameCount = 0;
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      URL.revokeObjectURL(videoElement.src);
      videoElement.remove();
      canvas.remove();
      resolve(blob);
    };
    
    // Start recording and playing
    mediaRecorder.start(1000); // Capture in 1-second chunks
    videoElement.play();
    
    // Render frames
    function drawFrame() {
      if (videoElement.ended || frameCount > videoElement.duration * 60) { // Limit to 60fps
        mediaRecorder.stop();
        return;
      }
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      frameCount++;
      requestAnimationFrame(drawFrame);
    }
    
    drawFrame();
  });
};

// Spreadsheet Conversions
export const convertSpreadsheet = async (file: File, targetFormat: string): Promise<Blob> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  let output: string | ArrayBuffer;
  let mimeType: string;
  
  switch (targetFormat.toLowerCase()) {
    case 'xlsx':
      output = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        bookSST: true,
        compression: true
      });
      mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      break;
    case 'csv':
      // Get the first sheet
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      output = XLSX.utils.sheet_to_csv(firstSheet, { 
        blankrows: false,
        dateNF: 'YYYY-MM-DD'
      });
      mimeType = 'text/csv';
      break;
    case 'xls':
      output = XLSX.write(workbook, { 
        bookType: 'xls', 
        type: 'array',
        bookSST: true
      });
      mimeType = 'application/vnd.ms-excel';
      break;
    case 'ods':
      output = XLSX.write(workbook, { 
        bookType: 'ods', 
        type: 'array',
        compression: true
      });
      mimeType = 'application/vnd.oasis.opendocument.spreadsheet';
      break;
    default:
      throw new Error('Unsupported format');
  }
  
  return new Blob([output], { type: mimeType });
};

// Helper function to download the converted file
export const downloadFile = (blob: Blob, filename: string) => {
  saveAs(blob, filename);
};

// Helper function to create an audio track from buffer
function createAudioTrack(buffer: AudioBuffer): MediaStreamTrack {
  const ctx = new AudioContext();
  const source = ctx.createBufferSource();
  const dest = ctx.createMediaStreamDestination();
  source.buffer = buffer;
  source.connect(dest);
  source.start();
  return dest.stream.getAudioTracks()[0];
}

// Helper function to get proper MIME type
function getMimeType(format: string): string {
  const format_lower = format.toLowerCase();
  switch (format_lower) {
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    case 'ogg':
      return 'audio/ogg';
    case 'm4a':
      return 'audio/mp4';
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'mov':
      return 'video/quicktime';
    case 'avi':
      return 'video/x-msvideo';
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
} 