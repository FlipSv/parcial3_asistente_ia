import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

export const ChatScreen = ({
  messages,
  onSendMessage,
  onClearChat,
  isLoading,
  onNavigateToTasks,
}) => {
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const suggestedPrompts = [
    '¿Qué tengo pendiente hoy?',
    'Recuérdame entregar el parcial hoy a las 11:59 PM',
    'Dame un consejo para concentrarme',
    '¿Cómo organizar mi sesión de estudio?',
  ];

  const handleSend = () => {
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handleSelectPrompt = (prompt) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  useEffect(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isLoading]);

  const renderItem = ({ item }) => {
    const isAssistant = item.sender === 'assistant';
    return (
      <View
        style={[
          styles.messageRow,
          isAssistant ? styles.assistantRow : styles.userRow,
        ]}
      >
        {isAssistant && (
          <View style={styles.assistantAvatar}>
            <Text style={styles.avatarIcon}>🤖</Text>
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isAssistant ? styles.assistantBubble : styles.userBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isAssistant ? styles.assistantText : styles.userText,
            ]}
          >
            {item.text}
          </Text>

          {/* If a task was created from this message, display action card */}
          {item.createdTask ? (
            <TouchableOpacity
              style={styles.taskCardPill}
              onPress={onNavigateToTasks}
              activeOpacity={0.8}
            >
              <Text style={styles.taskCardPillTitle}>
                ✅ Tarea creada en Agenda:
              </Text>
              <Text style={styles.taskCardPillText}>
                📌 "{item.createdTask.title}"
              </Text>
              <Text style={styles.taskCardPillMeta}>
                Prioridad: {item.createdTask.priority} • Vence: {item.createdTask.dueDate} (Toca para ver)
              </Text>
            </TouchableOpacity>
          ) : null}

          <Text
            style={[
              styles.timestamp,
              isAssistant ? styles.assistantTimestamp : styles.userTimestamp,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Top Banner with Clear Button */}
      <View style={styles.topBar}>
        <View style={styles.topInfo}>
          <Text style={styles.topTitle}>Conversación Asistente IA</Text>
          <Text style={styles.topSubtitle}>Procesamiento de Lenguaje Natural Activo</Text>
        </View>
        <TouchableOpacity style={styles.clearBtn} onPress={onClearChat}>
          <Text style={styles.clearBtnText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      {/* Suggested Chips */}
      <View style={styles.chipsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suggestedPrompts}
          keyExtractor={(item, idx) => `chip-${idx}`}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleSelectPrompt(item)}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.chipsContent}
        />
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading ? (
            <View style={styles.loadingRow}>
              <View style={styles.assistantAvatar}>
                <Text style={styles.avatarIcon}>🤖</Text>
              </View>
              <View style={[styles.bubble, styles.assistantBubble, styles.loadingBubble]}>
                <ActivityIndicator size="small" color="#4F46E5" />
                <Text style={styles.loadingText}>Nova está pensando...</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Input Bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje o tarea (ej: 'Recuérdame...')"
          placeholderTextColor="#94A3B8"
          value={inputText}
          onChangeText={setInputText}
          multiline={false}
          returnKeyType="send"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  topInfo: {
    flex: 1,
  },
  topTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  topSubtitle: {
    fontSize: 11,
    color: '#10B981',
  },
  clearBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  clearBtnText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  chipsContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  chipsContent: {
    paddingHorizontal: 12,
  },
  chip: {
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  chipText: {
    fontSize: 11.5,
    color: '#4338CA',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 2,
  },
  avatarIcon: {
    fontSize: 16,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  assistantBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 13.5,
    lineHeight: 19,
  },
  assistantText: {
    color: '#1E293B',
  },
  userText: {
    color: '#FFFFFF',
  },
  taskCardPill: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
  },
  taskCardPillTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#15803D',
  },
  taskCardPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#166534',
    marginVertical: 2,
  },
  taskCardPillMeta: {
    fontSize: 10.5,
    color: '#15803D',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  assistantTimestamp: {
    color: '#94A3B8',
  },
  userTimestamp: {
    color: '#C7D2FE',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  loadingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    fontSize: 13.5,
    color: '#0F172A',
    maxHeight: 90,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 2,
  },
});
