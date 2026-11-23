import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Text,
} from 'react-native';
import { Header } from './src/components/Header';
import { TabNavigation } from './src/components/TabNavigation';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ChatScreen } from './src/screens/ChatScreen';
import { TasksScreen } from './src/screens/TasksScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { storageService } from './src/services/storageService';
import { aiEngine } from './src/services/aiEngine';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Initialize data from persistent storage
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTasks, loadedMessages, loadedSettings] = await Promise.all([
          storageService.getTasks(),
          storageService.getMessages(),
          storageService.getSettings(),
        ]);
        setTasks(loadedTasks);
        setMessages(loadedMessages);
        setSettings(loadedSettings);
      } catch (err) {
        console.error('Error initializing app state:', err);
      } finally {
        setIsReady(true);
      }
    }
    loadData();
  }, []);

  // Handler: Send message in chat and process with AI
  const handleSendMessage = async (text) => {
    if (!text || isLoadingAI) return;

    // 1. Add user message
    const userMsg = await storageService.addMessage({
      sender: 'user',
      text,
    });
    setMessages((prev) => [...prev, userMsg]);
    setIsLoadingAI(true);

    try {
      // 2. Process with AI Engine (Gemini / Contextual NLP)
      const currentTasks = await storageService.getTasks();
      const result = await aiEngine.processUserInput(text, settings, currentTasks);

      // If a task was created by the AI engine, refresh task list
      if (result.createdTask) {
        const updatedTasks = await storageService.getTasks();
        setTasks(updatedTasks);
      }

      // 3. Add Assistant response
      const assistantMsg = await storageService.addMessage({
        sender: 'assistant',
        text: result.reply,
        createdTask: result.createdTask,
      });
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error('Error processing AI response:', error);
      const errorMsg = await storageService.addMessage({
        sender: 'assistant',
        text: 'Lo siento, ocurrió un error temporal al procesar tu solicitud. Por favor intenta de nuevo.',
      });
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Handler: Quick action from dashboard to Chat
  const handleQuickPrompt = (text) => {
    setCurrentTab('chat');
    setTimeout(() => {
      handleSendMessage(text);
    }, 200);
  };

  // Handler: Toggle task completion
  const handleToggleTask = async (id) => {
    const updated = await storageService.toggleTask(id);
    setTasks(updated);
  };

  // Handler: Add new task
  const handleAddTask = async (taskData) => {
    const newTask = await storageService.addTask(taskData);
    setTasks((prev) => [newTask, ...prev]);
  };

  // Handler: Delete task
  const handleDeleteTask = async (id) => {
    const updated = await storageService.deleteTask(id);
    setTasks(updated);
  };

  // Handler: Save settings
  const handleSaveSettings = async (newSettings) => {
    await storageService.saveSettings(newSettings);
    setSettings(newSettings);
  };

  // Handler: Clear chat
  const handleClearChat = async () => {
    const cleared = await storageService.clearMessages();
    setMessages(cleared);
  };

  // Handler: Reset mock demo data
  const handleResetData = async () => {
    await storageService.resetAllData();
    const [t, m, s] = await Promise.all([
      storageService.getTasks(),
      storageService.getMessages(),
      storageService.getSettings(),
    ]);
    setTasks(t);
    setMessages(m);
    setSettings(s);
  };

  if (!isReady || !settings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingLabel}>Iniciando Nova Asistente IA...</Text>
      </View>
    );
  }

  const pendingCount = tasks.filter((t) => !t.completed).length;

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Nova Asistente';
      case 'chat':
        return 'Asistente Personal';
      case 'tasks':
        return 'Agenda & Tareas';
      case 'settings':
        return 'Configuración';
      default:
        return 'Nova AI';
    }
  };

  const getHeaderSubtitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Panel de Productividad Diaria';
      case 'chat':
        return 'Inteligencia Artificial Activa';
      case 'tasks':
        return `${pendingCount} actividades pendientes`;
      case 'settings':
        return 'Preferencias del Sistema';
      default:
        return '';
    }
  };

  const getEngineBadge = () => {
    if (settings.aiEngine === 'gemini') return 'Gemini Cloud';
    if (settings.aiEngine === 'ollama') return 'Ollama Local';
    return 'Nova NLP';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <Header
        title={getHeaderTitle()}
        subtitle={getHeaderSubtitle()}
        engineName={getEngineBadge()}
      />

      <View style={styles.screenContainer}>
        {currentTab === 'dashboard' && (
          <DashboardScreen
            settings={settings}
            tasks={tasks}
            onNavigate={(tab) => setCurrentTab(tab)}
            onToggleTask={handleToggleTask}
            onAskAI={handleQuickPrompt}
          />
        )}
        {currentTab === 'chat' && (
          <ChatScreen
            messages={messages}
            onSendMessage={handleSendMessage}
            onClearChat={handleClearChat}
            isLoading={isLoadingAI}
            onNavigateToTasks={() => setCurrentTab('tasks')}
          />
        )}
        {currentTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
        {currentTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetData={handleResetData}
            onClearChat={handleClearChat}
          />
        )}
      </View>

      <TabNavigation
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingCount={pendingCount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#4F46E5',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingLabel: {
    marginTop: 12,
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
});
