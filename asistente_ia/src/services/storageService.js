import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@nova_tasks_v1';
const CHAT_KEY = '@nova_chat_v1';
const SETTINGS_KEY = '@nova_settings_v1';

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Entregar parcial 3 de Programación para Móviles',
    description: 'Subir código a GitHub y entregar documento formal con requerimientos.',
    category: 'Estudio',
    priority: 'Alta',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: 'Hoy, 11:59 PM',
  },
  {
    id: '2',
    title: 'Realizar pruebas en emuladores móviles',
    description: 'Verificar funcionamiento en Pixel 7, Galaxy S21 e iPhone 14 Pro.',
    category: 'Estudio',
    priority: 'Alta',
    completed: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    dueDate: 'Hoy',
  },
  {
    id: '3',
    title: 'Revisar documentación de arquitectura en capas',
    description: 'Validar diagramas de casos de uso y secuencia.',
    category: 'Estudio',
    priority: 'Media',
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    dueDate: 'Mañana',
  },
  {
    id: '4',
    title: 'Pausa activa y tomar agua',
    description: 'Descanso de 10 minutos para mantener la productividad.',
    category: 'Salud',
    priority: 'Baja',
    completed: true,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    dueDate: 'Diario',
  },
];

const INITIAL_SETTINGS = {
  userName: 'Felipe',
  userRole: 'Estudiante de Ingeniería UDI',
  aiEngine: 'contextual', // 'contextual' | 'gemini' | 'ollama'
  geminiApiKey: '',
  ollamaUrl: 'http://10.0.2.2:11434', // default android emulator host IP
  aiTone: 'Empático y Motivador', // 'Empático y Motivador' | 'Formal y Ejecutivo' | 'Breve y Conciso'
  notificationsEnabled: true,
  theme: 'light',
};

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    sender: 'assistant',
    text: '¡Hola, Felipe! 👋 Soy Nova, tu asistente personal con Inteligencia Artificial. ¿En qué te puedo ayudar hoy? Puedes pedirme organizar tus tareas, darte ideas de estudio o darte un resumen de tu jornada.',
    timestamp: new Date(Date.now() - 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdTask: null,
  },
];

export const storageService = {
  // --- TASKS ---
  async getTasks() {
    try {
      const data = await AsyncStorage.getItem(TASKS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // Seed initial tasks on first run
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    } catch (e) {
      console.error('Error reading tasks:', e);
      return INITIAL_TASKS;
    }
  },

  async saveTasks(tasks) {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
      return true;
    } catch (e) {
      console.error('Error saving tasks:', e);
      return false;
    }
  },

  async addTask(task) {
    const current = await this.getTasks();
    const newTask = {
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
      category: 'General',
      priority: 'Media',
      dueDate: 'Pendiente',
      ...task,
    };
    const updated = [newTask, ...current];
    await this.saveTasks(updated);
    return newTask;
  },

  async toggleTask(id) {
    const current = await this.getTasks();
    const updated = current.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    await this.saveTasks(updated);
    return updated;
  },

  async deleteTask(id) {
    const current = await this.getTasks();
    const updated = current.filter((t) => t.id !== id);
    await this.saveTasks(updated);
    return updated;
  },

  // --- CHAT MESSAGES ---
  async getMessages() {
    try {
      const data = await AsyncStorage.getItem(CHAT_KEY);
      if (data) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    } catch (e) {
      console.error('Error reading chat:', e);
      return INITIAL_MESSAGES;
    }
  },

  async saveMessages(messages) {
    try {
      await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(messages));
      return true;
    } catch (e) {
      console.error('Error saving chat:', e);
      return false;
    }
  },

  async addMessage(msg) {
    const current = await this.getMessages();
    const newMsg = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...msg,
    };
    const updated = [...current, newMsg];
    await this.saveMessages(updated);
    return newMsg;
  },

  async clearMessages() {
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(INITIAL_MESSAGES));
    return INITIAL_MESSAGES;
  },

  // --- SETTINGS ---
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
      }
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    } catch (e) {
      console.error('Error reading settings:', e);
      return INITIAL_SETTINGS;
    }
  },

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  },

  async resetAllData() {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(INITIAL_TASKS));
    await AsyncStorage.setItem(CHAT_KEY, JSON.stringify(INITIAL_MESSAGES));
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(INITIAL_SETTINGS));
    return true;
  },
};
