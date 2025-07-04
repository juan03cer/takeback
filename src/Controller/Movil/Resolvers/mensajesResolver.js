// Importamos el modelo de Mongoose que representa la colección de mensajes tipo chat
const ChatbotMovil = require('../../../Data/model/ChatMovil');

const mensajesResolver = {
  // Sección de consultas (queries)
  Query: {
    // Consulta para obtener todos los historiales de chat de un usuario específico
    obtenerChatPorUsuario: async (_, { usuarioId }) => {
      // Buscamos en la base de datos todos los registros con el ID del usuario proporcionado
      const historial = await ChatbotMovil.find({ usuarioId });
      // Devolvemos el historial encontrado
      return historial;
    }
  },

  // Sección de mutaciones (modificaciones de datos)
  Mutation: {
    // Mutación para guardar un nuevo historial de chat
    guardarMensajesChat: async (_, { input }, ctx) => {
      try {
        // Verificamos que el usuario esté autenticado (viene del token decodificado en el contexto)
        if (!ctx.usuarios || !ctx.usuarios.id) {
          throw new Error('No autorizado');
        }

        // Creamos un nuevo documento de historial de chat usando el modelo y los datos del input
        const nuevoHistorial = new ChatbotMovil({
          usuarioId: ctx.usuarios.id,      // Asignamos el ID del usuario autenticado
          mensaje: input.mensaje           // Asignamos los mensajes recibidos en el input
        });

        // Guardamos el nuevo historial en la base de datos
        const resultado = await nuevoHistorial.save();

        // Retornamos el historial guardado como respuesta de la mutación
        return resultado;

      } catch (error) {
        // Si ocurre algún error, lo mostramos en consola y lanzamos un mensaje más genérico
        console.error("Error al guardar chat:", error);
        throw new Error("No se pudo guardar el chat");
      }
    }
  }
};

// Exportamos los resolvers para que puedan ser usados por el servidor Apollo
module.exports = mensajesResolver;
