import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform, Pressable, ActivityIndicator, Modal, KeyboardAvoidingView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import TaskList from './src/components/Task';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem as ITask } from './src/utils/handle-api';

const COLORS = { bg: '#F2F2F7', primary: '#007AFF', gray: '#8E8E93', white: '#fff' };

export default function App() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  // Estado único para o formulário (Boas Práticas: Object State)
  const [form, setForm] = useState({ id: "", text: "", date: "", completed: false, rawDate: new Date() });

  useEffect(() => { getAllTasks(setTasks, setLoading); }, []);

  const toggleModal = (task?: ITask) => {
    if (task) {
      const [d, m, y] = task.dueDate?.split('/').map(Number) || [];
      setForm({ id: task._id, text: task.text, date: task.dueDate || "", completed: !!task.completed, rawDate: d ? new Date(y, m - 1, d) : new Date() });
    } else {
      setForm({ id: "", text: "", date: "", completed: false, rawDate: new Date() });
    }
    setModalVisible(!modalVisible);
  };

  const handleSave = () => {
    const cb = () => { setModalVisible(false); getAllTasks(setTasks); };
    if (form.id) updateTask(form.id, form.text, form.completed, form.date, setTasks, cb);
    else addTask(form.text, form.completed, form.date, setTasks, cb);
  };

  const onDateChange = (_: DateTimePickerEvent, date?: Date) => {
    setShowPicker(false);
    if (date) setForm({ ...form, rawDate: date, date: date.toLocaleDateString('pt-BR') });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tarefas</Text>
          <Text style={styles.subtitle}>{tasks.filter(t => !t.completed).length} pendentes</Text>
        </View>

        <TaskList tasks={tasks} onEdit={(id) => toggleModal(tasks.find(t => t._id === id))} onToggle={(id, t, s, d) => updateTask(id, t, !s, d, setTasks, () => getAllTasks(setTasks))} onDelete={(id) => deleteTask(id, setTasks)} />

        <Modal animationType="fade" transparent visible={modalVisible}>
          <View style={styles.overlay}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalView}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{form.id ? 'Editar' : 'Nova'} Tarefa</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}><Feather name="x" size={20} color={COLORS.gray} /></TouchableOpacity>
                </View>

                <TextInput style={styles.input} placeholder="O que fazer?" value={form.text} onChangeText={(t) => setForm({...form, text: t})} autoFocus />
                
                {Platform.OS === 'web' ? (
                  <input type="date" style={styles.webDate} onChange={(e) => onDateChange({} as any, new Date(e.target.value + 'T12:00:00'))} />
                ) : (
                  <TouchableOpacity style={styles.input} onPress={() => setShowPicker(true)}>
                    <Text style={{ color: form.date ? '#000' : COLORS.gray }}>{form.date || "Selecionar data"}</Text>
                  </TouchableOpacity>
                )}

                <View style={styles.checkRow}>
                  <Checkbox style={styles.checkbox} value={form.completed} onValueChange={(v) => setForm({...form, completed: v})} color={form.completed ? COLORS.primary : undefined} />
                  <Text style={styles.checkLabel}>Concluída</Text>
                </View>

                <Pressable style={({ pressed }) => [styles.btnSave, { opacity: form.text ? 1 : 0.4 }, pressed && styles.btnPressed]} onPress={handleSave} disabled={!form.text}>
                  <Text style={styles.btnSaveText}>Salvar</Text>
                </Pressable>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        <Pressable style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]} onPress={() => toggleModal()}>
          <Feather name="plus" size={22} color="#fff" /><Text style={styles.fabText}>Nova Tarefa</Text>
        </Pressable>

        {showPicker && Platform.OS !== 'web' && <DateTimePicker value={form.rawDate} mode="date" onChange={onDateChange} />}
        {loading && <ActivityIndicator style={StyleSheet.absoluteFill} size="large" color={COLORS.primary} />}
      </View>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1, paddingHorizontal: 20, maxWidth: 600, alignSelf: 'center', width: '100%' },
  header: { marginTop: 40, marginBottom: 20, alignItems: 'center' },
  title: { fontSize: 38, fontWeight: '900', letterSpacing: -1.5 },
  subtitle: { color: COLORS.gray, fontWeight: '600' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalView: { width: '100%', maxWidth: 480, alignSelf: 'center' },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 28, padding: 28, elevation: 12 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  closeBtn: { backgroundColor: COLORS.bg, padding: 8, borderRadius: 20 },
  input: { backgroundColor: COLORS.bg, borderRadius: 14, padding: 18, marginBottom: 15, fontSize: 16 },
  webDate: { backgroundColor: COLORS.bg, borderRadius: '14px', padding: '18px', marginBottom: '15px', border: 'none', width: '100%', boxSizing: 'border-box' } as any,
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  checkbox: { width: 22, height: 22, borderRadius: 7 },
  checkLabel: { fontSize: 16, fontWeight: '600' },
  btnSave: { backgroundColor: COLORS.primary, padding: 18, borderRadius: 22, alignItems: 'center' },
  btnSaveText: { color: '#fff', fontWeight: '800', fontSize: 17 },
  btnPressed: { transform: [{ scale: 0.98 }], elevation: 0 },
  fab: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 28, borderRadius: 32, elevation: 10 },
  fabPressed: { transform: [{ scale: 0.95 }], opacity: 0.9 },
  fabText: { color: '#fff', fontWeight: '800', marginLeft: 10, fontSize: 17 },
});