import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Pressable, ActivityIndicator, Modal, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import TaskList from './src/components/Task';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [completed, setCompleted] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => { getAllTasks(setTasks, setLoading); }, []);

  const openModal = (id = "", currentText = "", date = "", isCompleted = false) => {
    if (id) {
      setTaskId(id); setText(currentText); setDueDate(date); setCompleted(isCompleted);
    } else {
      setTaskId(""); setText(""); setDueDate(""); setCompleted(false);
    }
    setModalVisible(true);
  };

  const handleSave = () => {
    const onSuccess = () => { setModalVisible(false); setText(""); };
    if (taskId) { 
      updateTask(taskId, text, completed, dueDate, setTasks, onSuccess); 
    } else { 
      addTask(text, completed, dueDate, setTasks, onSuccess); 
    }
  };

  const toggleTaskStatus = (id: string, taskText: string, status: boolean, date: string) => {
    updateTask(id, taskText, !status, date, setTasks, () => {});
  };

  const formatDataInput = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    if (cleaned.length > 4) formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    setDueDate(formatted);
  };

  const pendingCount = tasks.filter(t => !t.completed || t.completed === 0).length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Tarefas</Text>
          <View style={styles.badge}>
            <Text style={styles.subHeader}>{pendingCount} pendente{pendingCount !== 1 ? 's' : ''}</Text>
          </View>
        </View>

        <TaskList 
          tasks={tasks} 
          onEdit={openModal}
          onToggle={toggleTaskStatus} 
          onDelete={(id) => deleteTask(id, setTasks)} 
        />

        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalCenteredView}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{taskId ? 'Editar Tarefa' : 'Nova Tarefa'}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                    <Feather name="x" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
                
                <TextInput style={styles.modalInput} placeholder="O que você precisa fazer?" value={text} onChangeText={setText} autoFocus />
                <TextInput style={styles.modalInput} placeholder="Data limite (DD/MM/AAAA)" value={dueDate} onChangeText={formatDataInput} keyboardType="numeric" maxLength={10} />

                <View style={styles.checkboxRow}>
                  <Checkbox
                    style={styles.checkbox}
                    value={completed}
                    onValueChange={setCompleted}
                    color={completed ? '#007AFF' : undefined}
                  />
                  <Pressable onPress={() => setCompleted(!completed)}>
                    <Text style={styles.checkboxLabel}>Marcar como concluída</Text>
                  </Pressable>
                </View>

                <Pressable 
                  style={({ pressed }) => [styles.btnSave, { opacity: (text && pressed) ? 0.7 : (text ? 1 : 0.4) }]} 
                  onPress={handleSave} 
                  disabled={!text}
                >
                  <Text style={styles.btnSaveText}>Salvar Tarefa</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <View style={styles.fabContainer}>
          <Pressable 
            style={({ pressed }) => [styles.fab, pressed && { transform: [{ scale: 0.95 }] }]} 
            onPress={() => openModal()}
          >
            <Feather name="plus" size={22} color="#fff" />
            <Text style={styles.fabText}>Nova Tarefa</Text>
          </Pressable>
        </View>

        {loading && <View style={styles.loader}><ActivityIndicator size="large" color="#007AFF" /></View>}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F2F2F7', paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  container: { flex: 1, paddingHorizontal: 20, alignSelf: 'center', width: '100%', maxWidth: 600 },
  headerContainer: { marginTop: 40, marginBottom: 30, alignItems: 'center' },
  headerTitle: { fontSize: 38, fontWeight: '900', color: '#000', letterSpacing: -1.5 },
  badge: { backgroundColor: 'rgba(142, 142, 147, 0.12)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, marginTop: 6 },
  subHeader: { fontSize: 14, color: '#636366', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCenteredView: { width: '100%', maxWidth: 480 },
  modalContent: { backgroundColor: '#fff', borderRadius: 28, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  modalTitle: { fontSize: 20, fontWeight: '800', letterSpacing: -0.5 },
  closeBtn: { backgroundColor: '#F2F2F7', padding: 8, borderRadius: 24 },
  modalInput: { backgroundColor: '#F2F2F7', borderRadius: 14, padding: 18, fontSize: 17, marginBottom: 18, color: '#000' },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 24, paddingHorizontal: 6 },
  checkbox: { width: 22, height: 22, borderRadius: 7 },
  checkboxLabel: { fontSize: 16, color: '#000', fontWeight: '600' },
  btnSave: { backgroundColor: '#007AFF', padding: 18, borderRadius: 22, alignItems: 'center', marginTop: 10, shadowColor: '#007AFF', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
  btnSaveText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  fabContainer: { position: 'absolute', bottom: 44, left: 0, right: 0, alignItems: 'center' },
  fab: { backgroundColor: '#007AFF', flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 32, elevation: 10, shadowColor: '#007AFF', shadowOpacity: 0.35, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  fabText: { color: '#fff', fontWeight: '800', fontSize: 17, marginLeft: 10 },
  loader: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(242,242,247,0.85)' }
});