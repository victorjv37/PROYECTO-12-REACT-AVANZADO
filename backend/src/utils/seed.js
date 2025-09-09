import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import Usuario from "../models/Usuario.js";
import Evento from "../models/Evento.js";
import { conectarBD } from "../config/database.js";

// Datos de ejemplo para usuarios
const usuariosEjemplo = [
  {
    nombre: "Naruto Uzumaki",
    email: "naruto@konoha.com",
    password: "123456",
    avatar: null,
  },
  {
    nombre: "Sasuke Uchiha",
    email: "sasuke@konoha.com",
    password: "123456",
    avatar: null,
  },
  {
    nombre: "Sakura Haruno",
    email: "sakura@konoha.com",
    password: "123456",
    avatar: null,
  },
  {
    nombre: "Kakashi Hatake",
    email: "kakashi@konoha.com",
    password: "123456",
    avatar: null,
  },
  {
    nombre: "Hinata Hyuga",
    email: "hinata@konoha.com",
    password: "123456",
    avatar: null,
  },
];

// Función para generar eventos de ejemplo
const generarEventosEjemplo = (usuarios) => {
  const categorias = [
    "conferencia",
    "taller",
    "networking",
    "social",
    "deportivo",
    "cultural",
  ];
  const ubicaciones = [
    "Aldea de la Hoja - Academia Ninja",
    "Torre Hokage - Sala de Reuniones",
    "Campo de Entrenamiento 7",
    "Ichiraku Ramen - Salón Privado",
    "Bosque de la Muerte - Área Segura",
    "Monte Hokage - Mirador",
    "Hospital de Konoha - Auditorio",
    "Biblioteca Ninja - Sala de Conferencias",
  ];

  // URLs de imágenes temáticas para los carteles de eventos
  const cartelesNaruto = [
    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=700&fit=crop&crop=center", // Torneo de Artes Marciales - martial arts
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop&crop=center", // Conferencia Chakra - meditation/energy
    "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=500&h=700&fit=crop&crop=center", // Taller Ramen - food/cooking
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=700&fit=crop&crop=center", // Consejo Hokages - meeting/leadership
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=700&fit=crop&crop=center", // Entrenamiento Combate - training/sports
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&h=700&fit=crop&crop=center", // Festival Primavera - celebration
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=700&fit=crop&crop=center", // Seminario Medicina - medical/health
    "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=700&fit=crop&crop=center", // Competencia Shurikens - archery/precision
    "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?w=500&h=700&fit=crop&crop=center", // Día del Ninja - traditional
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=700&fit=crop&crop=center", // Workshop Infiltración - stealth/ninja
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&h=700&fit=crop&crop=center", // Gala Benéfica - elegant/charity
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=700&fit=crop&crop=center", // Supervivencia Bosque - nature/forest
  ];

  const títulos = [
    "Torneo de Artes Marciales Ninja",
    "Conferencia sobre Nuevas Técnicas de Chakra",
    "Taller de Cocina con Ramen Especial",
    "Reunión del Consejo de Hokages",
    "Entrenamiento Avanzado de Combate",
    "Festival de Primavera de Konoha",
    "Seminario de Medicina Ninja",
    "Competencia de Shurikens",
    "Celebración del Día del Ninja",
    "Workshop de Técnicas de Infiltración",
    "Gala Benéfica para Huérfanos Ninja",
    "Curso de Supervivencia en el Bosque",
  ];

  const descripciones = [
    "Un evento épico donde los mejores ninjas demuestran sus habilidades en combate.",
    "Aprende las últimas innovaciones en el manejo del chakra de manos de expertos.",
    "Descubre los secretos culinarios del famoso Ichiraku Ramen.",
    "Importante reunión para discutir el futuro de las aldeas ninja.",
    "Entrenamiento intensivo para ninjas de élite.",
    "Celebra la llegada de la primavera con música, comida y espectáculos.",
    "Conoce las técnicas médicas más avanzadas para ninjas.",
    "Demuestra tu puntería en esta emocionante competencia.",
    "Una jornada completa dedicada a honrar la tradición ninja.",
    "Perfecciona tus habilidades de sigilo y espionaje.",
    "Evento solidario para apoyar a los jóvenes ninjas en formación.",
    "Aprende a sobrevivir en los entornos más hostiles.",
  ];

  const eventos = [];

  for (let i = 0; i < 12; i++) {
    const fechaBase = new Date();
    fechaBase.setDate(fechaBase.getDate() + Math.floor(Math.random() * 60) + 1); // Entre 1 y 60 días desde hoy

    const evento = {
      titulo: títulos[i],
      descripcion: descripciones[i],
      fecha: fechaBase,
      ubicacion: ubicaciones[Math.floor(Math.random() * ubicaciones.length)],
      categoria: categorias[Math.floor(Math.random() * categorias.length)],
      precio: Math.random() > 0.3 ? Math.floor(Math.random() * 5000) : 0, // 70% de eventos con precio
      capacidadMaxima: Math.floor(Math.random() * 50) + 10, // Entre 10 y 60 personas
      estado: "activo",
      creador: usuarios[Math.floor(Math.random() * usuarios.length)]._id,
      asistentes: [], // Llenaremos esto después
      cartel: cartelesNaruto[i], // Asignar cartel temático correspondiente
    };

    eventos.push(evento);
  }

  return eventos;
};

// Función para asignar asistentes aleatorios a eventos
const asignarAsistentesAleatorios = (eventos, usuarios) => {
  eventos.forEach((evento) => {
    const numAsistentes = Math.floor(
      Math.random() * Math.min(evento.capacidadMaxima / 2, usuarios.length)
    );
    const asistentesSeleccionados = [];

    for (let i = 0; i < numAsistentes; i++) {
      const usuarioAleatorio =
        usuarios[Math.floor(Math.random() * usuarios.length)];
      if (
        !asistentesSeleccionados.includes(usuarioAleatorio._id) &&
        !evento.creador.equals(usuarioAleatorio._id)
      ) {
        asistentesSeleccionados.push(usuarioAleatorio._id);
      }
    }

    evento.asistentes = asistentesSeleccionados;
  });
};

// Función principal para ejecutar la semilla
const ejecutarSemilla = async () => {
  try {
    console.log("🌱 Iniciando semilla de datos...");
    console.log("📍 Directorio actual:", process.cwd());
    console.log("🔗 Conectando a la base de datos...");

    // Conectar a la base de datos
    await conectarBD();

    // Limpiar datos existentes
    console.log("🧹 Limpiando datos existentes...");
    await Usuario.deleteMany({});
    await Evento.deleteMany({});

    // Crear usuarios
    console.log("👥 Creando usuarios de ejemplo...");
    const usuariosCreados = [];

    for (const userData of usuariosEjemplo) {
      const salt = await bcryptjs.genSalt(12);
      const hashedPassword = await bcryptjs.hash(userData.password, salt);

      const usuario = new Usuario({
        ...userData,
        password: hashedPassword,
      });

      const usuarioGuardado = await usuario.save();
      usuariosCreados.push(usuarioGuardado);
      console.log(`  ✅ Usuario creado: ${usuario.nombre} (${usuario.email})`);
    }

    // Crear eventos
    console.log("📅 Creando eventos de ejemplo...");
    const eventosEjemplo = generarEventosEjemplo(usuariosCreados);
    asignarAsistentesAleatorios(eventosEjemplo, usuariosCreados);

    const eventosCreados = [];
    for (const eventoData of eventosEjemplo) {
      const evento = new Evento(eventoData);
      const eventoGuardado = await evento.save();
      eventosCreados.push(eventoGuardado);
      console.log(`  ✅ Evento creado: ${evento.titulo}`);
    }

    // Actualizar usuarios con referencias a eventos
    console.log("🔗 Actualizando referencias de usuarios...");
    for (const usuario of usuariosCreados) {
      const eventosCreados = await Evento.find({ creador: usuario._id });
      const eventosAsistidos = await Evento.find({ asistentes: usuario._id });

      usuario.eventosCreados = eventosCreados.map((e) => e._id);
      usuario.eventosAsistidos = eventosAsistidos.map((e) => e._id);

      await usuario.save();
    }

    console.log("\n🎉 ¡Semilla ejecutada exitosamente!");
    console.log(`📊 Usuarios creados: ${usuariosCreados.length}`);
    console.log(`📊 Eventos creados: ${eventosCreados.length}`);
    console.log(`🖼️  Cada evento incluye su cartel temático`);
    console.log("\n📋 Usuarios de prueba:");
    usuariosCreados.forEach((user) => {
      console.log(`  👤 ${user.nombre} - ${user.email} (contraseña: 123456)`);
    });

    console.log(
      "\n💡 Puedes usar cualquiera de estos usuarios para hacer login en la aplicación."
    );
    console.log("🎨 Todos los eventos incluyen carteles visuales temáticos.");
  } catch (error) {
    console.error("❌ Error ejecutando la semilla:", error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log("🔌 Conexión a la base de datos cerrada.");
    process.exit(0);
  }
};

// Ejecutar la semilla si el archivo se ejecuta directamente
ejecutarSemilla();

export default ejecutarSemilla;
