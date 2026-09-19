import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Configuration de Cloudinary avec vos variables d'environnement
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST() {
  try {
    // 1. Génère un timestamp actuel (requis par Cloudinary pour éviter les vieilles requêtes)
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // 2. Récupère le nom du preset
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!uploadPreset) {
      throw new Error("Le preset d'upload Cloudinary est manquant dans le fichier .env.local");
    }

    // 3. Génère la signature cryptée grâce à votre API Secret
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
        upload_preset: uploadPreset,
      },
      process.env.CLOUDINARY_API_SECRET!
    );

    // 4. Renvoie le ticket d'accès sécurisé (timestamp + signature) au navigateur
    return NextResponse.json({ timestamp, signature });
    
  } catch (error: any) {
    console.error("Erreur de génération de signature Cloudinary :", error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la signature de sécurité' }, 
      { status: 500 }
    );
  }
}