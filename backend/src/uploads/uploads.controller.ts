import {
  Controller, Post, UploadedFile, UseGuards, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as fs from 'fs';

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
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
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey    = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (cloudName && apiKey && apiSecret) {
      // Producción: subir a Cloudinary v2
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const cloudinary = require('cloudinary').v2;
      cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });

      const result = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'la-terraza' }, (error: any, res: any) => {
            if (error) reject(error);
            else resolve(res);
          })
          .end(file.buffer);
      });

      return { url: result.secure_url, filename: result.public_id };
    }

    // Desarrollo: guardar en disco local
    const unique   = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = unique + extname(file.originalname);
    const dir      = join(process.cwd(), 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(join(dir, filename), file.buffer);
    return { url: `/uploads/${filename}`, filename };
  }
}
