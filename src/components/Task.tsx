import React from 'react';
import { SectionList, Text, StyleSheet, View } from 'react-native';
import { TaskItem } from './TaskItem';
import { TaskItem as TaskData } from '../utils/handle-api';

interface TaskListProps {
  tasks: TaskData[];
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

export const Task: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const sections = [
    {
      title: 'A fazer',
      data: tasks.filter(t => t.text.length > 10),
    },
    {
      title: 'Concluídas',
      data: tasks.filter(t => t.text.length <= 10),
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <TaskItem 
          text={item.text} 
          onEdit={() => onEdit(item._id, item.text)} 
          onDelete={() => onDelete(item._id)} 
        />
      )}
      renderSectionHeader={({ section: { title, data } }) => (
        data.length > 0 ? <Text style={styles.sectionHeader}>{title}</Text> : null
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 8,
    marginTop: 16,
  },
});



