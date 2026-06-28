import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Sembrando base de datos de La Terraza...');

  // Restaurante
  await prisma.restaurant.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'La Terraza',
      slogan: 'Una experiencia que empieza desde la primera vista',
      descripcion:
        'Somos un espacio creado para quienes buscan más que una comida. La Terraza nació en 2018 con la visión de combinar cocina de autor, ambiente íntimo y una carta de cócteles que te sorprenderá. Cada plato cuenta una historia, cada copa celebra el momento.',
      direccion: 'Av. Reforma 450, Col. Centro, Ciudad de México, CDMX',
      telefono: '+52 55 1234 5678',
      whatsapp: '5215512345678',
      correo: 'hola@laterraza.mx',
      ciudad: 'Ciudad de México',
      pais: 'México',
      colorPrimario: '#1a1a2e',
      colorSecundario: '#c9a84c',
      colorAcento: '#e94560',
      metaDescripcion:
        'La Terraza — Restaurante bar en Ciudad de México. Cocina de autor, cócteles artesanales y ambiente único. Reserva tu mesa.',
      metaKeywords:
        'restaurante CDMX, bar Ciudad de México, cocina de autor, cócteles artesanales, reservar mesa',
      horarios: {
        lunes: { abierto: false },
        martes: { abierto: true, apertura: '13:00', cierre: '23:00' },
        miercoles: { abierto: true, apertura: '13:00', cierre: '23:00' },
        jueves: { abierto: true, apertura: '13:00', cierre: '23:30' },
        viernes: { abierto: true, apertura: '13:00', cierre: '01:00' },
        sabado: { abierto: true, apertura: '12:00', cierre: '01:00' },
        domingo: { abierto: true, apertura: '12:00', cierre: '22:00' },
      },
      redesSociales: {
        instagram: 'https://instagram.com/laterraza',
        facebook: 'https://facebook.com/laterraza',
        tiktok: 'https://tiktok.com/@laterraza',
      },
      coordenadas: { lat: 19.4326, lng: -99.1332 },
    },
  });

  // Usuario administrador
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@laterraza.mx' },
    update: {},
    create: {
      nombre: 'Administrador',
      email: 'admin@laterraza.mx',
      password: hashedPassword,
      rol: 'ADMIN',
    },
  });

  // Categorías
  const entradas = await prisma.category.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, nombre: 'Entradas', icono: '🥗', orden: 1 },
  });

  const principales = await prisma.category.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, nombre: 'Platillos Principales', icono: '🍽️', orden: 2 },
  });

  const cortes = await prisma.category.upsert({
    where: { id: 3 },
    update: {},
    create: { id: 3, nombre: 'Cortes y Parrilla', icono: '🥩', orden: 3 },
  });

  const cocteles = await prisma.category.upsert({
    where: { id: 4 },
    update: {},
    create: { id: 4, nombre: 'Cócteles', icono: '🍹', orden: 4 },
  });

  const bebidas = await prisma.category.upsert({
    where: { id: 5 },
    update: {},
    create: { id: 5, nombre: 'Bebidas', icono: '🥤', orden: 5 },
  });

  const postres = await prisma.category.upsert({
    where: { id: 6 },
    update: {},
    create: { id: 6, nombre: 'Postres', icono: '🍮', orden: 6 },
  });

  // Productos — Entradas
  const productosEntradas = [
    {
      nombre: 'Ceviche de Atún Rojo',
      descripcion: 'Atún sellado, aguacate, pepino, jalapeño, citrus y aceite de ajonjolí tostado',
      precio: 185,
      destacado: true,
      orden: 1,
    },
    {
      nombre: 'Carpaccio de Res',
      descripcion: 'Láminas de res angus, alcaparras, parmesano, rúcula y vinagreta de mostaza Dijon',
      precio: 165,
      destacado: false,
      orden: 2,
    },
    {
      nombre: 'Tabla de Quesos Artesanales',
      descripcion: 'Selección de 4 quesos mexicanos con mermelada de higo, nueces y pan artesanal',
      precio: 210,
      destacado: true,
      orden: 3,
    },
    {
      nombre: 'Aguachile de Camarón',
      descripcion: 'Camarones frescos, salsa verde picante, pepino, cebolla morada y totopos',
      precio: 175,
      destacado: false,
      orden: 4,
    },
  ];

  for (const p of productosEntradas) {
    await prisma.product.create({ data: { ...p, categoriaId: entradas.id } });
  }

  // Productos — Principales
  const productosPrincipales = [
    {
      nombre: 'Pulpo a la Brasa',
      descripcion: 'Pulpo mediterráneo braseado, puré de papa ahumado, chimichurri de hierbas y limón confitado',
      precio: 295,
      destacado: true,
      orden: 1,
    },
    {
      nombre: 'Pasta de Trufa Negra',
      descripcion: 'Fettuccine fresco, crema de trufa negra, hongos silvestres, parmesano y aceite trufado',
      precio: 265,
      destacado: false,
      orden: 2,
    },
    {
      nombre: 'Salmón en Costra de Hierbas',
      descripcion: 'Salmón atlántico, costra de hierbas frescas, risotto de espárragos y salsa buerre blanc',
      precio: 285,
      destacado: true,
      orden: 3,
    },
    {
      nombre: 'Hamburguesa La Terraza',
      descripcion: 'Carne angus 200g, queso gouda ahumado, cebolla caramelizada, tocino crocante y mayonesa de chipotle',
      precio: 195,
      destacado: false,
      orden: 4,
    },
  ];

  for (const p of productosPrincipales) {
    await prisma.product.create({ data: { ...p, categoriaId: principales.id } });
  }

  // Productos — Cortes
  const productosCortes = [
    {
      nombre: 'Rib Eye 400g',
      descripcion: 'Corte importado USDA Choice, acompañado de papas al romero y verduras asadas',
      precio: 485,
      destacado: true,
      orden: 1,
    },
    {
      nombre: 'New York 350g',
      descripcion: 'Corte angus, término a elección, con mantequilla de ajo negro y papa gratinada',
      precio: 425,
      destacado: false,
      orden: 2,
    },
    {
      nombre: 'Filete Mignon 250g',
      descripcion: 'El corte más tierno, en salsa de vino tinto reducido, con puré trufado',
      precio: 395,
      destacado: true,
      orden: 3,
    },
  ];

  for (const p of productosCortes) {
    await prisma.product.create({ data: { ...p, categoriaId: cortes.id } });
  }

  // Productos — Cócteles
  const productosCocteles = [
    {
      nombre: 'Terraza Mule',
      descripcion: 'Vodka artesanal, jengibre fresco, jugo de limón, cerveza de jengibre y menta',
      precio: 135,
      destacado: true,
      orden: 1,
    },
    {
      nombre: 'Mezcal Sour',
      descripcion: 'Mezcal espadín, jugo de limón, jarabe de agave, clara de huevo y sal de gusano',
      precio: 145,
      destacado: true,
      orden: 2,
    },
    {
      nombre: 'Negroni Clásico',
      descripcion: 'Gin London Dry, vermut rojo, Campari y twist de naranja',
      precio: 130,
      destacado: false,
      orden: 3,
    },
    {
      nombre: 'Margarita de Maracuyá',
      descripcion: 'Tequila reposado, maracuyá fresco, cointreau, jugo de limón y sal ahumada',
      precio: 140,
      destacado: false,
      orden: 4,
    },
    {
      nombre: 'Old Fashioned de Whisky',
      descripcion: 'Bourbon premium, azúcar mascabado, bitters de angostura y twist de naranja',
      precio: 155,
      destacado: false,
      orden: 5,
    },
  ];

  for (const p of productosCocteles) {
    await prisma.product.create({ data: { ...p, categoriaId: cocteles.id } });
  }

  // Productos — Bebidas
  const productosBebidas = [
    { nombre: 'Agua Mineral', descripcion: 'San Pellegrino 500ml', precio: 45, destacado: false, orden: 1 },
    { nombre: 'Agua Natural', descripcion: 'Evian 500ml', precio: 40, destacado: false, orden: 2 },
    { nombre: 'Jugo Natural del Día', descripcion: 'Fruta de temporada, sin azúcar añadida', precio: 65, destacado: false, orden: 3 },
    { nombre: 'Café Americano', descripcion: 'Blend de origen único, preparación en aeropress', precio: 55, destacado: false, orden: 4 },
    { nombre: 'Café con Leche', descripcion: 'Espresso doble con leche vaporizada', precio: 65, destacado: false, orden: 5 },
  ];

  for (const p of productosBebidas) {
    await prisma.product.create({ data: { ...p, categoriaId: bebidas.id } });
  }

  // Productos — Postres
  const productosPostres = [
    {
      nombre: 'Coulant de Chocolate',
      descripcion: 'Bizcocho de chocolate oscuro con centro fundente, helado de vainilla de Madagascar',
      precio: 115,
      destacado: true,
      orden: 1,
    },
    {
      nombre: 'Cheesecake de Frutos Rojos',
      descripcion: 'Base de galleta, crema de queso artesanal, coulis de frambuesa y blueberries frescos',
      precio: 105,
      destacado: false,
      orden: 2,
    },
    {
      nombre: 'Crème Brûlée',
      descripcion: 'Crema de vainilla, costra de azúcar caramelizada y fresas maceradas',
      precio: 95,
      destacado: false,
      orden: 3,
    },
    {
      nombre: 'Tabla de Postres Miniatura',
      descripcion: 'Selección de 4 mini postres del día para compartir',
      precio: 175,
      destacado: true,
      orden: 4,
    },
  ];

  for (const p of productosPostres) {
    await prisma.product.create({ data: { ...p, categoriaId: postres.id } });
  }

  // Reservas demo
  await prisma.reservation.createMany({
    data: [
      {
        nombreCliente: 'María González',
        telefono: '+52 55 9876 5432',
        correo: 'maria@email.com',
        fecha: new Date('2026-07-01'),
        hora: '20:00',
        personas: 4,
        comentarios: 'Cumpleaños de mi esposo, por favor una decoración especial',
        estado: 'CONFIRMADA',
      },
      {
        nombreCliente: 'Carlos Mendoza',
        telefono: '+52 55 1111 2222',
        correo: 'carlos@email.com',
        fecha: new Date('2026-07-02'),
        hora: '14:00',
        personas: 2,
        estado: 'PENDIENTE',
      },
      {
        nombreCliente: 'Ana Ruiz',
        telefono: '+52 55 3333 4444',
        fecha: new Date('2026-07-03'),
        hora: '21:00',
        personas: 6,
        comentarios: 'Cena de negocios, necesitamos zona privada',
        estado: 'PENDIENTE',
      },
    ],
  });

  console.log('Base de datos sembrada exitosamente.');
  console.log('Credenciales admin: admin@laterraza.mx / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
