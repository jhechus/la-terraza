export interface Horario {
  abierto: boolean;
  apertura?: string;
  cierre?: string;
}

export interface Horarios {
  lunes: Horario;
  martes: Horario;
  miercoles: Horario;
  jueves: Horario;
  viernes: Horario;
  sabado: Horario;
  domingo: Horario;
}

export interface RedesSociales {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  twitter?: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Restaurant {
  id: number;
  nombre: string;
  slogan: string;
  descripcion: string;
  logo?: string;
  direccion: string;
  telefono: string;
  whatsapp: string;
  correo: string;
  ciudad: string;
  pais: string;
  horarios: Horarios;
  redesSociales: RedesSociales;
  colorPrimario: string;
  colorSecundario: string;
  colorAcento: string;
  metaDescripcion: string;
  metaKeywords: string;
  coordenadas?: Coordenadas;
}
