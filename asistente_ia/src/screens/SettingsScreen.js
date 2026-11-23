import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

export const SettingsScreen = ({
  settings,
  onSaveSettings,
  onResetData,
  onClearChat,
}) => {
  const [userName, setUserName] = useState(settings?.userName || 'Felipe');
  const [userRole, setUserRole] = useState(settings?.userRole || 'Estudiante UDI');
  const [aiEngine, setAiEngine] = useState(settings?.aiEngine || 'contextual');
  const [geminiApiKey, setGeminiApiKey] = useState(settings?.geminiApiKey || '');
  const [ollamaUrl, setOllamaUrl] = useState(settings?.ollamaUrl || 'http://10.0.2.2:11434');
  const [aiTone, setAiTone] = useState(settings?.aiTone || 'Empático y Motivador');

  const tones = [
    'Empático y Motivador',
    'Formal y Ejecutivo',
    'Breve y Conciso',
  ];

  const handleSave = () => {
    onSaveSettings({
      ...settings,
      userName: userName.trim(),
      userRole: userRole.trim(),
      aiEngine,
      geminiApiKey: geminiApiKey.trim(),
      ollamaUrl: ollamaUrl.trim(),
      aiTone,
    });
    Alert.alert('Éxito', 'Configuración guardada correctamente.');
  };

  const handleConfirmReset = () => {
    Alert.alert(
      'Restablecer Datos',
      '¿Deseas restaurar las tareas y mensajes iniciales de prueba?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Restablecer', style: 'destructive', onPress: onResetData },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <Text style={styles.sectionTitle}>Perfil de Usuario</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nombre completo / alias:</Text>
        <TextInput
          style={styles.input}
          value={userName}
          onChangeText={setUserName}
          placeholder="Tu nombre"
        />

        <Text style={styles.label}>Rol u ocupación:</Text>
        <TextInput
          style={styles.input}
          value={userRole}
          onChangeText={setUserRole}
          placeholder="Ej: Estudiante de Ingeniería UDI"
        />
      </View>

      {/* AI Engine Selection */}
      <Text style={styles.sectionTitle}>Motor de Inteligencia Artificial</Text>
      <View style={styles.card}>
        {/* Contextual Local */}
        <TouchableOpacity
          style={[styles.engineOption, aiEngine === 'contextual' && styles.engineOptionActive]}
          onPress={() => setAiEngine('contextual')}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, aiEngine === 'contextual' && styles.radioActive]}>
            {aiEngine === 'contextual' ? <View style={styles.radioInner} /> : null}
          </View>
          <View style={styles.engineTextWrap}>
            <Text style={styles.engineTitle}>🧠 Motor Contextual Inteligente (Offline)</Text>
            <Text style={styles.engineSubtitle}>
              Recomendado para pruebas y emuladores. Procesa lenguaje natural y crea tareas de forma autónoma sin consumir cuota.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Gemini Cloud */}
        <TouchableOpacity
          style={[styles.engineOption, aiEngine === 'gemini' && styles.engineOptionActive]}
          onPress={() => setAiEngine('gemini')}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, aiEngine === 'gemini' && styles.radioActive]}>
            {aiEngine === 'gemini' ? <View style={styles.radioInner} /> : null}
          </View>
          <View style={styles.engineTextWrap}>
            <Text style={styles.engineTitle}>☁️ Google Gemini 1.5 Flash (Cloud API)</Text>
            <Text style={styles.engineSubtitle}>
              Conecta directamente con la API oficial de Google para respuestas generativas avanzadas en la nube.
            </Text>
          </View>
        </TouchableOpacity>

        {aiEngine === 'gemini' && (
          <View style={styles.keyContainer}>
            <Text style={styles.label}>Clave API de Google Gemini:</Text>
            <TextInput
              style={styles.input}
              placeholder="Pega aquí tu Gemini API Key (AIzaSy...)"
              placeholderTextColor="#94A3B8"
              value={geminiApiKey}
              onChangeText={setGeminiApiKey}
              secureTextEntry
              autoCapitalize="none"
            />
            <Text style={styles.helpText}>
              * Se almacena de forma segura en el almacenamiento local del dispositivo.
            </Text>
          </View>
        )}

        {/* Ollama Local */}
        <TouchableOpacity
          style={[styles.engineOption, aiEngine === 'ollama' && styles.engineOptionActive]}
          onPress={() => setAiEngine('ollama')}
          activeOpacity={0.7}
        >
          <View style={[styles.radioCircle, aiEngine === 'ollama' && styles.radioActive]}>
            {aiEngine === 'ollama' ? <View style={styles.radioInner} /> : null}
          </View>
          <View style={styles.engineTextWrap}>
            <Text style={styles.engineTitle}>🖥️ Ollama Local LLM (DeepSeek / Llama)</Text>
            <Text style={styles.engineSubtitle}>
              Servidor local en tu red o equipo de desarrollo.
            </Text>
          </View>
        </TouchableOpacity>

        {aiEngine === 'ollama' && (
          <View style={styles.keyContainer}>
            <Text style={styles.label}>URL Servidor Ollama:</Text>
            <TextInput
              style={styles.input}
              value={ollamaUrl}
              onChangeText={setOllamaUrl}
              placeholder="http://10.0.2.2:11434"
              autoCapitalize="none"
            />
          </View>
        )}
      </View>

      {/* Tone of Voice */}
      <Text style={styles.sectionTitle}>Tono de Asistencia de Nova</Text>
      <View style={styles.card}>
        <View style={styles.tonesRow}>
          {tones.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.toneChip, aiTone === t && styles.toneChipActive]}
              onPress={() => setAiTone(t)}
            >
              <Text style={[styles.toneChipText, aiTone === t && styles.toneChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={styles.saveBtnText}>💾 Guardar Configuración</Text>
      </TouchableOpacity>

      {/* Maintenance Section */}
      <Text style={styles.sectionTitle}>Mantenimiento y Datos</Text>
      <View style={styles.card}>
        <TouchableOpacity style={styles.dangerBtn} onPress={onClearChat} activeOpacity={0.7}>
          <Text style={styles.dangerBtnText}>🗑️ Borrar Historial de Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.dangerBtn, { marginTop: 10, backgroundColor: '#FEF2F2' }]}
          onPress={handleConfirmReset}
          activeOpacity={0.7}
        >
          <Text style={[styles.dangerBtnText, { color: '#DC2626' }]}>
            🔄 Restaurar Datos de Demostración
          </Text>
        </TouchableOpacity>
      </View>

      {/* Academic Credits */}
      <View style={styles.creditsCard}>
        <Text style={styles.creditsTitle}>Universidad de Investigación y Desarrollo (UDI)</Text>
        <Text style={styles.creditsSubtitle}>Parcial 3 – Programación para Móviles</Text>
        <Text style={styles.creditsDetail}>Electiva Profesional 1 • Año 2026</Text>
        <Text style={styles.creditsVersion}>Nova AI Assistant v1.0.0 • React Native & Expo</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  engineOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  engineOptionActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#A5B4FC',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  radioActive: {
    borderColor: '#4F46E5',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4F46E5',
  },
  engineTextWrap: {
    flex: 1,
  },
  engineTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  engineSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  keyContainer: {
    marginTop: 8,
    paddingLeft: 30,
  },
  helpText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  tonesRow: {
    flexDirection: 'column',
  },
  toneChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  toneChipActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  toneChipText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },
  toneChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  dangerBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dangerBtnText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '600',
  },
  creditsCard: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    marginTop: 10,
  },
  creditsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  creditsSubtitle: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 2,
  },
  creditsDetail: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 2,
  },
  creditsVersion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
});
