import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';

export const TasksScreen = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [filter, setFilter] = useState('all'); // 'all' | 'pending' | 'completed' | 'high'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Estudio');
  const [newPriority, setNewPriority] = useState('Media');
  const [newDueDate, setNewDueDate] = useState('Hoy');

  const categories = ['Estudio', 'Trabajo', 'Personal', 'Salud'];
  const priorities = ['Alta', 'Media', 'Baja'];

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    if (filter === 'high') return t.priority === 'Alta' && !t.completed;
    return true;
  });

  const handleCreateTask = () => {
    if (!newTitle.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el título de la tarea.');
      return;
    }
    onAddTask({
      title: newTitle.trim(),
      description: 'Creada manualmente por el usuario.',
      category: newCategory,
      priority: newPriority,
      dueDate: newDueDate,
    });
    setNewTitle('');
    setIsModalOpen(false);
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={[styles.checkCircle, item.completed && styles.checkCircleActive]}
          onPress={() => onToggleTask(item.id)}
          activeOpacity={0.7}
        >
          {item.completed ? <Text style={styles.checkCheckmark}>✓</Text> : null}
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <Text style={[styles.taskTitle, item.completed && styles.taskTitleCompleted]}>
            {item.title}
          </Text>
          {item.description ? (
            <Text style={styles.taskDesc} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            <View
              style={[
                styles.badgePriority,
                item.priority === 'Alta' && styles.badgeHigh,
                item.priority === 'Baja' && styles.badgeLow,
              ]}
            >
              <Text
                style={[
                  styles.badgePriorityText,
                  item.priority === 'Alta' && styles.badgeHighText,
                  item.priority === 'Baja' && styles.badgeLowText,
                ]}
              >
                {item.priority}
              </Text>
            </View>
            <View style={styles.badgeCategory}>
              <Text style={styles.badgeCategoryText}>{item.category}</Text>
            </View>
            <Text style={styles.dueDateText}>⏰ {item.dueDate}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => onDeleteTask(item.id)}
          activeOpacity={0.6}
        >
          <Text style={styles.deleteIcon}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Summary */}
      <View style={styles.summaryBar}>
        <View>
          <Text style={styles.summaryTitle}>Mis Pendientes</Text>
          <Text style={styles.summarySub}>
            {pendingCount} pendientes • {completedCount} completadas
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtnHeader}
          onPress={() => setIsModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.addBtnHeaderText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterChipText, filter === 'all' && styles.filterChipTextActive]}>
            Todas ({tasks.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'pending' && styles.filterChipActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterChipText, filter === 'pending' && styles.filterChipTextActive]}>
            Pendientes ({pendingCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'completed' && styles.filterChipActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterChipText, filter === 'completed' && styles.filterChipTextActive]}>
            Completadas ({completedCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, filter === 'high' && styles.filterChipActive]}
          onPress={() => setFilter('high')}
        >
          <Text style={[styles.filterChipText, filter === 'high' && styles.filterChipTextActive]}>
            🔥 Urgentes
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No hay tareas en esta categoría</Text>
            <Text style={styles.emptySubtitle}>
              Crea una nueva tarea o pídele a Nova que la registre por ti.
            </Text>
          </View>
        }
      />

      {/* Modal Add Task */}
      <Modal visible={isModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nueva Tarea / Recordatorio</Text>

            <Text style={styles.inputLabel}>Título de la tarea:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Estudiar para parcial de móviles"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />

            <Text style={styles.inputLabel}>Categoría:</Text>
            <View style={styles.selectorRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.selectorChip, newCategory === cat && styles.selectorChipActive]}
                  onPress={() => setNewCategory(cat)}
                >
                  <Text
                    style={[
                      styles.selectorChipText,
                      newCategory === cat && styles.selectorChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Prioridad:</Text>
            <View style={styles.selectorRow}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.selectorChip, newPriority === p && styles.selectorChipActive]}
                  onPress={() => setNewPriority(p)}
                >
                  <Text
                    style={[
                      styles.selectorChipText,
                      newPriority === p && styles.selectorChipTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Fecha / Hora sugerida:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej: Hoy a las 6:00 PM"
              placeholderTextColor="#94A3B8"
              value={newDueDate}
              onChangeText={setNewDueDate}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setIsModalOpen(false)}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmitBtn}
                onPress={handleCreateTask}
              >
                <Text style={styles.modalSubmitText}>Guardar Tarea</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  summarySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addBtnHeader: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  addBtnHeaderText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  filterChipActive: {
    backgroundColor: '#4F46E5',
  },
  filterChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
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
    marginTop: 2,
  },
  checkCircleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  checkCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 18,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    flexWrap: 'wrap',
  },
  badgePriority: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 6,
  },
  badgePriorityText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  badgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  badgeHighText: {
    color: '#B91C1C',
  },
  badgeLow: {
    backgroundColor: '#DCFCE7',
  },
  badgeLowText: {
    color: '#15803D',
  },
  badgeCategory: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4338CA',
  },
  dueDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  deleteBtn: {
    padding: 6,
    marginLeft: 6,
  },
  deleteIcon: {
    fontSize: 14,
    color: '#CBD5E1',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginTop: 10,
    marginBottom: 5,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  selectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectorChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  selectorChipActive: {
    backgroundColor: '#4F46E5',
  },
  selectorChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
  },
  selectorChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 18,
  },
  modalCancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#64748B',
    fontWeight: '600',
  },
  modalSubmitBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 8,
  },
  modalSubmitText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
