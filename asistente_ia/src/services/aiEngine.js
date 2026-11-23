import { storageService } from './storageService';

/**
 * Motor de Inteligencia Artificial para el Asistente Personal Nova
 * Ofrece soporte híbrido:
 * 1. Google Gemini API (Modo Nube)
 * 2. Ollama Local API (Modo Local LLM)
 * 3. Motor Contextual Inteligente NLP Integrado (Modo Offline / Autónomo)
 */
export const aiEngine = {
  async processUserInput(userText, settings, existingTasks = []) {
    const trimmed = userText.trim();
    if (!trimmed) {
      return {
        reply: 'No recibí ningún mensaje. ¿En qué puedo orientarte hoy?',
        createdTask: null,
      };
    }

    // 1. First, check if intent is to create or record a task
    const taskIntent = this.detectTaskCreationIntent(trimmed);
    let createdTask = null;

    if (taskIntent.isTask) {
      createdTask = await storageService.addTask({
        title: taskIntent.title,
        description: `Creada automáticamente por Nova IA a partir de: "${trimmed}"`,
        category: taskIntent.category,
        priority: taskIntent.priority,
        dueDate: taskIntent.dueDate,
      });
    }

    // 2. Route according to selected AI engine
    if (settings.aiEngine === 'gemini' && settings.geminiApiKey) {
      try {
        const geminiReply = await this.callGeminiApi(trimmed, settings, existingTasks, createdTask);
        return {
          reply: geminiReply,
          createdTask,
        };
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Contextual Engine:', err);
        // Graceful fallback to Contextual Engine
        const fallbackReply = this.generateContextualResponse(trimmed, settings, existingTasks, createdTask);
        return {
          reply: `[Nota: Conexión Gemini no disponible, respondiendo con motor local]\n\n${fallbackReply}`,
          createdTask,
        };
      }
    } else if (settings.aiEngine === 'ollama' && settings.ollamaUrl) {
      try {
        const ollamaReply = await this.callOllamaApi(trimmed, settings, existingTasks, createdTask);
        return {
          reply: ollamaReply,
          createdTask,
        };
      } catch (err) {
        console.warn('Ollama API call failed, falling back to Contextual Engine:', err);
        const fallbackReply = this.generateContextualResponse(trimmed, settings, existingTasks, createdTask);
        return {
          reply: `[Nota: Ollama local no alcanzable, respondiendo con motor local]\n\n${fallbackReply}`,
          createdTask,
        };
      }
    }

    // Default: Motor Contextual Inteligente (Offline / Autónomo)
    const localReply = this.generateContextualResponse(trimmed, settings, existingTasks, createdTask);
    return {
      reply: localReply,
      createdTask,
    };
  },

  /**
   * Extractor de intenciones y entidades NLP para tareas
   */
  detectTaskCreationIntent(text) {
    const lower = text.toLowerCase();
    const taskTriggers = [
      'recuérdame',
      'recuerdame',
      'crear tarea',
      'nueva tarea',
      'añadir tarea',
      'anota',
      'agendar',
      'agenda',
      'tengo que',
      'debo',
      'recordatorio:',
      'tarea:',
    ];

    let isTask = false;
    let title = text;

    for (const trigger of taskTriggers) {
      if (lower.startsWith(trigger) || lower.includes(` ${trigger} `)) {
        isTask = true;
        // Clean trigger from title
        const idx = lower.indexOf(trigger);
        const rawTitle = text.slice(idx + trigger.length).replace(/^(:|\s+que\s+|\s+de\s+|\s+)/i, '');
        if (rawTitle.length > 2) {
          title = rawTitle.charAt(0).toUpperCase() + rawTitle.slice(1);
        }
        break;
      }
    }

    if (!isTask) {
      return { isTask: false };
    }

    // Determine category
    let category = 'General';
    if (lower.includes('parcial') || lower.includes('estudiar') || lower.includes('udi') || lower.includes('clase') || lower.includes('examen') || lower.includes('tarea') || lower.includes('proyecto')) {
      category = 'Estudio';
    } else if (lower.includes('trabajo') || lower.includes('reunión') || lower.includes('informe') || lower.includes('cliente')) {
      category = 'Trabajo';
    } else if (lower.includes('agua') || lower.includes('ejercicio') || lower.includes('caminar') || lower.includes('descanso') || lower.includes('médico')) {
      category = 'Salud';
    } else if (lower.includes('comprar') || lower.includes('casa') || lower.includes('familia') || lower.includes('pago')) {
      category = 'Personal';
    }

    // Determine priority
    let priority = 'Media';
    if (lower.includes('urgente') || lower.includes('hoy') || lower.includes('importante') || lower.includes('parcial') || lower.includes('ya')) {
      priority = 'Alta';
    } else if (lower.includes('luego') || lower.includes('cuando pueda') || lower.includes('opcional')) {
      priority = 'Baja';
    }

    // Due date
    let dueDate = 'Pronto';
    if (lower.includes('hoy')) dueDate = 'Hoy';
    else if (lower.includes('mañana') || lower.includes('manana')) dueDate = 'Mañana';
    else if (lower.includes('11:59') || lower.includes('noche')) dueDate = 'Hoy, 11:59 PM';

    return {
      isTask: true,
      title: title.trim(),
      category,
      priority,
      dueDate,
    };
  },

  /**
   * Generador de respuestas con NLP Contextual Local
   */
  generateContextualResponse(text, settings, tasks, createdTask) {
    const lower = text.toLowerCase();
    const userName = settings.userName || 'Usuario';
    const tone = settings.aiTone || 'Empático';

    // If a task was created
    if (createdTask) {
      if (tone === 'Breve y Conciso') {
        return `✅ Tarea registrada: "${createdTask.title}" (${createdTask.priority} - ${createdTask.category}).`;
      } else if (tone === 'Formal y Ejecutivo') {
        return `Se ha registrado exitosamente la tarea "${createdTask.title}" con categoría [${createdTask.category}] y nivel de prioridad [${createdTask.priority}]. Queda agendada en su lista de pendientes.`;
      } else {
        return `¡Listo, ${userName}! 🎯 He creado la tarea:\n\n📌 "${createdTask.title}"\n🏷️ Categoría: ${createdTask.category} | Prioridad: ${createdTask.priority}\n⏰ Vencimiento: ${createdTask.dueDate}\n\nPuedes revisarla y marcarla como completada en la pestaña de Tareas.`;
      }
    }

    // Pending tasks query
    if (lower.includes('tarea') || lower.includes('pendiente') || lower.includes('que tengo') || lower.includes('agenda')) {
      const pending = tasks.filter((t) => !t.completed);
      const completed = tasks.filter((t) => t.completed);

      if (pending.length === 0) {
        return `¡Excelente noticia, ${userName}! 🎉 No tienes ninguna tarea pendiente en este momento. Tienes ${completed.length} tareas completadas. ¿Deseas que programemos una nueva actividad?`;
      }

      const listPreview = pending
        .slice(0, 4)
        .map((t, i) => `${i + 1}. [${t.priority}] ${t.title}`)
        .join('\n');

      return `📋 ${userName}, actualmente tienes ${pending.length} tareas pendientes (${completed.length} completadas):\n\n${listPreview}\n\n¿Quieres que te ayude a priorizar alguna en particular?`;
    }

    // Daily briefing / Resumen del día
    if (lower.includes('resumen') || lower.includes('dia') || lower.includes('día') || lower.includes('cómo voy') || lower.includes('briefing')) {
      const pending = tasks.filter((t) => !t.completed);
      const completed = tasks.filter((t) => t.completed);
      const total = tasks.length;
      const progress = total > 0 ? Math.round((completed.length / total) * 100) : 0;

      return `📊 Resumen de tu jornada, ${userName}:\n\n` +
        `• Tareas completadas: ${completed.length} de ${total} (${progress}%)\n` +
        `• Pendientes clave: ${pending.length}\n` +
        `• Foco recomendado: Dedicar bloques de 25 minutos con técnica Pomodoro.\n` +
        `💡 Recuerda: "El éxito no es la velocidad, sino la constancia y el enfoque." ¡Ánimo con tus proyectos de la UDI!`;
    }

    // Study & Productivity tips
    if (lower.includes('estudiar') || lower.includes('consejo') || lower.includes('pomodoro') || lower.includes('concentra') || lower.includes('productiv')) {
      return `💡 Consejos de Productividad Inteligente para ti:\n\n` +
        `1. Técnica Pomodoro: 25 minutos de trabajo sin distracciones + 5 minutos de pausa.\n` +
        `2. Regla de los 2 minutos: Si una tarea toma menos de dos minutos, realízala de inmediato.\n` +
        `3. Matriz de Eisenhower: Separa lo urgente de lo importante.\n` +
        `4. Hidratación y postura: Tu rendimiento cognitivo mejora con descansos visuales cada hora.\n\n` +
        `¿Deseas que creemos un recordatorio para tu próxima sesión de estudio?`;
    }

    // Parcial / Universidad / UDI
    if (lower.includes('parcial') || lower.includes('móviles') || lower.includes('moviles') || lower.includes('udi')) {
      return `📱 Sobre tu proyecto de Móviles para la UDI:\n\n` +
        `Tu Asistente Nova está diseñado con una arquitectura modular en React Native y Expo, cumpliendo la metodología en Cascada y persistencia local.\n` +
        `Asegúrate de tener listos:\n` +
        `• Los diagramas de casos de uso y secuencia.\n` +
        `• Las pruebas en al menos 3 emuladores móviles.\n` +
        `• El repositorio de GitHub actualizado.\n\n` +
        `¡Todo va por excelente camino!`;
    }

    // Greetings
    if (lower.includes('hola') || lower.includes('buenos dias') || lower.includes('buenas tardes') || lower.includes('buenas noches') || lower.includes('hey')) {
      const hour = new Date().getHours();
      let saludo = '¡Hola';
      if (hour < 12) saludo = '¡Buenos días';
      else if (hour < 18) saludo = '¡Buenas tardes';
      else saludo = '¡Buenas noches';

      return `${saludo}, ${userName}! ✨ ¿En qué puedo asistirte en este momento? Puedo planear tus pendientes, responder dudas o crear recordatorios automáticos.`;
    }

    // Help & Capabilities
    if (lower.includes('ayuda') || lower.includes('hacer') || lower.includes('comandos') || lower.includes('opciones')) {
      return `🤖 Como tu Asistente Personal con IA puedo ayudarte en:\n\n` +
        `• Crear tareas automáticamente (Ej: "Recuérdame entregar el proyecto hoy a las 11 PM")\n` +
        `• Consultar tu agenda (Ej: "¿Cuáles son mis tareas pendientes?")\n` +
        `• Resumen diario de productividad (Ej: "Dame un resumen del día")\n` +
        `• Técnicas de estudio y concentración (Ej: "Dame un consejo para concentrarme")\n` +
        `• Integración con Google Gemini en la nube (desde Ajustes con tu API Key).\n\n` +
        `¿Qué deseas hacer primero?`;
    }

    // General Fallback
    return `Comprendo tu mensaje sobre "${text}". Como asistente inteligente, te recomiendo organizar tus prioridades y registrar cualquier compromiso pendiente. Si quieres que guarde esto como una tarea en tu agenda, solo dímelo ("Recuérdame...").`;
  },

  /**
   * Integración directa con Google Gemini API
   */
  async callGeminiApi(prompt, settings, tasks, createdTask) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`;

    const systemInstruction = `Eres "Nova", un asistente personal inteligente para dispositivos móviles desarrollado para estudiantes y profesionales.
Usuario actual: ${settings.userName} (${settings.userRole}).
Tono: ${settings.aiTone}.
Tareas actuales del usuario: ${JSON.stringify(tasks.slice(0, 5))}.
${createdTask ? `Acabas de crear la tarea: "${createdTask.title}". Confírmala amablemente al usuario.` : ''}
Responde de manera estructurada, cordial y orientada a la productividad. Máximo 150 palabras.`;

    const requestBody = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nMensaje del usuario: ${prompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || 'No se recibió texto del modelo Gemini.';
  },

  /**
   * Integración con Ollama Local
   */
  async callOllamaApi(prompt, settings, tasks, createdTask) {
    const endpoint = `${settings.ollamaUrl}/api/generate`;
    const promptText = `Eres Nova, un asistente personal móvil. Usuario: ${settings.userName}. Tono: ${settings.aiTone}.
${createdTask ? `Tarea creada: "${createdTask.title}".` : ''}
Responde brevemente a: "${prompt}"`;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'deepseek-r1:8b',
        prompt: promptText,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama Error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Respuesta vacía de Ollama.';
  },
};
