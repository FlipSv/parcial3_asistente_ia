import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { aiEngine as aiEngineService } from '../services/aiEngine';

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
  const [showKey, setShowKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [ollamaUrl, setOllamaUrl] = useState(settings?.ollamaUrl || 'http://10.0.2.2:11434');
  const [aiTone, setAiTone] = useState(settings?.aiTone || 'Empático y Motivador');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const tones = [
    'Empático y Motivador',
    'Formal y Ejecutivo',
    'Breve y Conciso',
  ];

  const handleSave = () => {
    const updated = {
      ...settings,
      userName: userName.trim(),
      userRole: userRole.trim(),
      aiEngine,
      geminiApiKey: geminiApiKey.trim(),
      ollamaUrl: ollamaUrl.trim(),
      aiTone,
    };
    onSaveSettings(updated);
    setSaveSuccessMsg('✅ ¡Configuración guardada correctamente!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
    Alert.alert('Éxito', 'Configuración guardada correctamente.');
  };

  const handleTestGeminiKey = async () => {
    const key = geminiApiKey.trim();
    if (!key) {
      setTestResult({
        success: false,
        message: 'Por favor ingresa tu Clave API antes de probar.',
      });
      return;
    }

    setIsTestingKey(true);
    setTestResult(null);

    try {
      const result = await aiEngineService.testGeminiConnection(key);
      setTestResult(result);

      if (result.success) {
        // Automatically save when valid
        const updated = {
          ...settings,
          userName: userName.trim(),
          userRole: userRole.trim(),
          aiEngine: 'gemini',
          geminiApiKey: key,
          ollamaUrl: ollamaUrl.trim(),
          aiTone,
        };
        onSaveSettings(updated);
        setSaveSuccessMsg('✅ Clave verificada y guardada como motor activo.');
      }
    } catch (e) {
      setTestResult({
        success: false,
        message: `Error al probar: ${e.message}`,
      });
    } finally {
      setIsTestingKey(false);
    }
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
      {saveSuccessMsg ? (
        <View style={styles.successBanner}>
          <Text style={styles.successBannerText}>{saveSuccessMsg}</Text>
        </View>
      ) : null}

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
            <Text style={styles.engineTitle}>☁️ Google Gemini (Cloud API)</Text>
            <Text style={styles.engineSubtitle}>
              Conecta directamente con la API oficial de Google para respuestas generativas avanzadas en la nube.
            </Text>
          </View>
        </TouchableOpacity>

        {aiEngine === 'gemini' && (
          <View style={styles.keyContainer}>
            <Text style={styles.label}>Clave API de Google Gemini:</Text>
            <View style={styles.keyInputRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Pega aquí tu clave (ej: AIzaSy...)"
                placeholderTextColor="#94A3B8"
                value={geminiApiKey}
                onChangeText={setGeminiApiKey}
                secureTextEntry={!showKey}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowKey(!showKey)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeBtnText}>{showKey ? 'Ocultar' : 'Ver'}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.helpText}>
              * Debe ser una clave generada en Google AI Studio (aistudio.google.com).
            </Text>

            {/* Test Key Button */}
            <TouchableOpacity
              style={[styles.testBtn, isTestingKey && styles.testBtnDisabled]}
              onPress={handleTestGeminiKey}
              disabled={isTestingKey}
              activeOpacity={0.8}
            >
              {isTestingKey ? (
                <View style={styles.testingRow}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.testBtnText}> Probando conexión con Google...</Text>
                </View>
              ) : (
                <Text style={styles.testBtnText}>🧪 Probar y Activar Clave API Ahora</Text>
              )}
            </TouchableOpacity>

            {/* Test Result Message */}
            {testResult && (
              <View
                style={[
                  styles.testResultBox,
                  testResult.success ? styles.testSuccessBox : styles.testErrorBox,
                ]}
              >
                <Text
                  style={[
                    styles.testResultText,
                    testResult.success ? styles.testSuccessText : styles.testErrorText,
                  ]}
                >
                  {testResult.message}
                </Text>
              </View>
            )}
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
  successBanner: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  successBannerText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
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
  keyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 9,
    marginLeft: 8,
  },
  eyeBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
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
    paddingLeft: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  helpText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  testBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  testBtnDisabled: {
    backgroundColor: '#818CF8',
  },
  testBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  testingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  testResultBox: {
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
  },
  testSuccessBox: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  testErrorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  testResultText: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  testSuccessText: {
    color: '#15803D',
    fontWeight: '600',
  },
  testErrorText: {
    color: '#B91C1C',
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
