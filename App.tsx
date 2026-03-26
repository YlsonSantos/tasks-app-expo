import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  SafeAreaView, Platform, StatusBar as RNStatusBar, 
  Image, Button, KeyboardAvoidingView 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Task } from './src/components/Task';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem as TaskData } from './src/utils/handle-api';

export default function App() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");

  useEffect(() => {
    getAllTasks(setTasks);
  }, []);

  const updateMode = (_id: string, text: string) => {
    setIsUpdating(true);
    setText(text);
    setTaskId(_id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Image 
          source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
          style={styles.logo} 
        />
        
        <Text style={styles.header}>Minhas tarefas</Text>
        
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de tarefas: {tasks.length}</Text>
        </View>

        <View style={styles.top}>
          <TextInput
            style={styles.input}
            placeholder="Nova tarefa..."
            value={text}
            onChangeText={setText}
            maxLength={40} 
            keyboardType="default"
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={isUpdating
                ? () => updateTask(taskId, text, setTasks, setText, setIsUpdating)
                : () => addTask(text, setText, setTasks)
            }
          >
            <Text style={styles.addButtonText}>{isUpdating ? "Salvar" : "+"}</Text>
          </TouchableOpacity>
        </View>

        <Task 
          tasks={tasks} 
          onEdit={updateMode} 
          onDelete={(id) => deleteTask(id, setTasks)} 
        />

        <View style={styles.footerAction}>
          <Button 
            title="Limpar lista" 
            onPress={() => console.log("Ação nativa executada")} 
            color="#000"
          />
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  logo: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginTop: 10,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  counterText: {
    color: '#666',
    fontSize: 14,
  },
  top: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  footerAction: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  }
});
