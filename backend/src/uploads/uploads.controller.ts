import {
  Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// En producción (Cloudinary configurado) usa cloud storage; en dev usa disco local.
const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

function buildStorageEngine() {
  if (isCloudinaryConfigured) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cloudinary = require('cloudinary').v2;
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key:    process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return new CloudinaryStorage({
      cloudinary,
      params: { folder: 'la-terraza', allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'] },
    });
  }

  return diskStorage({
    destination: join(process.cwd(), 'uploads'),
    filename: (_req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + extname(file.originalname));
    },
  });
}

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: buildStorageEngine(),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          cb(new BadRequestException('Solo se permiten imágenes'), false);
        } else {
          cb(null, true);
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');

    // Cloudinary devuelve file.path como URL completa; disco local devuelve file.filename
    const url = isCloudinaryConfigured
      ? (file as any).path
      : `/uploads/${file.filename}`;

    return { url, filename: file.filename ?? file.originalname };
  }
}
