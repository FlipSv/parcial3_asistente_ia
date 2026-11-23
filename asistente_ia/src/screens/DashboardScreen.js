import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export const DashboardScreen = ({
  settings,
  tasks,
  onNavigate,
  onToggleTask,
  onAskAI,
}) => {
  const userName = settings?.userName || 'Estudiante';
  const hour = new Date().getHours();

  let greeting = 'Buenos días';
  let greetingIcon = '☀️';
  if (hour >= 12 && hour < 18) {
    greeting = 'Buenas tardes';
    greetingIcon = '🌤️';
  } else if (hour >= 18 || hour < 5) {
    greeting = 'Buenas noches';
    greetingIcon = '🌙';
  }

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const total = tasks.length;
  const progressPercent = total > 0 ? Math.round((completedTasks.length / total) * 100) : 0;

  const urgentTasks = pendingTasks.slice(0, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Banner */}
      <View style={styles.welcomeCard}>
        <View style={styles.welcomeHeader}>
          <Text style={styles.greetingText}>
            {greetingIcon} {greeting}, {userName}
          </Text>
          <Text style={styles.userRoleText}>{settings.userRole || 'UDI - Móviles'}</Text>
        </View>
        <Text style={styles.welcomeSubtext}>
          Nova ha analizado tu agenda para hoy. Mantienes un {progressPercent}% de avance en tus compromisos.
        </Text>
        <View style={styles.aiTipBox}>
          <Text style={styles.aiTipTitle}>💡 Consejo inteligente de hoy:</Text>
          <Text style={styles.aiTipContent}>
            "Divide las tareas complejas en subtareas de 20 minutos para reducir la procrastinación."
          </Text>
        </View>
      </View>

      {/* Metrics Row */}
      <Text style={styles.sectionTitle}>Métricas de Productividad</Text>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { borderLeftColor: '#4F46E5' }]}>
          <Text style={styles.statNumber}>{pendingTasks.length}</Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
          <Text style={styles.statNumber}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Completadas</Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: '#F59E0B' }]}>
          <Text style={styles.statNumber}>{progressPercent}%</Text>
          <Text style={styles.statLabel}>Rendimiento</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Acciones Rápidas con IA</Text>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onAskAI('Dame un resumen detallado de mis tareas de hoy y cómo priorizarlas')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>📊</Text>
          <View style={styles.actionTextWrapper}>
            <Text style={styles.actionTitle}>Resumen del Día con IA</Text>
            <Text style={styles.actionSubtitle}>Nova analiza tus prioridades actuales</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onNavigate('chat')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <View style={styles.actionTextWrapper}>
            <Text style={styles.actionTitle}>Conversar con Nova</Text>
            <Text style={styles.actionSubtitle}>Pregunta dudas, pide tips o dicta tareas</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onNavigate('tasks')}
          activeOpacity={0.8}
        >
          <Text style={styles.actionIcon}>✍️</Text>
          <View style={styles.actionTextWrapper}>
            <Text style={styles.actionTitle}>Gestionar Mis Tareas</Text>
            <Text style={styles.actionSubtitle}>Ver lista completa, filtros y prioridades</Text>
          </View>
          <Text style={styles.actionArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Urgent Tasks Preview */}
      <View style={styles.tasksHeaderRow}>
        <Text style={styles.sectionTitle}>Próximas Tareas Críticas</Text>
        <TouchableOpacity onPress={() => onNavigate('tasks')}>
          <Text style={styles.seeAllText}>Ver todas ({tasks.length})</Text>
        </TouchableOpacity>
      </View>

      {urgentTasks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>🎉 ¡No tienes tareas pendientes urgentes!</Text>
        </View>
      ) : (
        urgentTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            onPress={() => onToggleTask(task.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkCircle}>
              <Text style={styles.checkIcon}>{task.completed ? '✓' : ''}</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                {task.title}
              </Text>
              <View style={styles.taskMetaRow}>
                <View style={[styles.badgePriority, task.priority === 'Alta' && styles.badgeHigh]}>
                  <Text style={styles.badgePriorityText}>{task.priority}</Text>
                </View>
                <Text style={styles.taskCategory}>{task.category}</Text>
                <Text style={styles.taskDueDate}>• {task.dueDate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}
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
    paddingBottom: 30,
  },
  welcomeCard: {
    backgroundColor: '#4338CA',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#4338CA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userRoleText: {
    fontSize: 11,
    color: '#C7D2FE',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  welcomeSubtext: {
    color: '#E0E7FF',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiTipBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 10,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#FDE047',
  },
  aiTipTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FDE047',
    marginBottom: 2,
  },
  aiTipContent: {
    fontSize: 11.5,
    color: '#FFFFFF',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  actionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  actionTextWrapper: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionSubtitle: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  actionArrow: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: 'bold',
  },
  tasksHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  seeAllText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkIcon: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  taskCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  badgePriority: {
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginRight: 6,
  },
  badgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  badgePriorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4338CA',
  },
  taskCategory: {
    fontSize: 11,
    color: '#64748B',
    marginRight: 4,
  },
  taskDueDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
  },
});
