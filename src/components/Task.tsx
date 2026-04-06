import React from 'react';
import { SectionList, Text, StyleSheet, View } from 'react-native';
import { TaskItem } from './TaskItem';
import { TaskItem as TaskData } from '../utils/handle-api';
import { Feather } from '@expo/vector-icons';

interface TaskProps {
  tasks: TaskData[];
  onEdit: (id: string, text: string, date: string, status: boolean) => void;
  onToggle: (id: string, text: string, currentStatus: boolean, dueDate: string) => void;
  onDelete: (id: string) => void;
}

export const Task: React.FC<TaskProps> = ({ tasks, onEdit, onToggle, onDelete }) => {
  const sections = [
    { 
      title: 'A FAZER', 
      icon: 'circle' as const,
      data: tasks.filter(t => !t.completed || t.completed === 0) 
    },
    { 
      title: 'CONCLUÍDAS', 
      icon: 'check-circle' as const,
      data: tasks.filter(t => t.completed === true || t.completed === 1) 
    },
  ];

  return (
    <SectionList
      sections={sections}
      keyExtractor={(item) => item._id}
      stickySectionHeadersEnabled={false}
      renderItem={({ item }) => (
        <TaskItem 
          text={item.text} 
          completed={!!item.completed}
          dueDate={item.dueDate}
          onEdit={() => onEdit(item._id, item.text, item.dueDate || "", !!item.completed)}
          onToggle={() => onToggle(item._id, item.text, !!item.completed, item.dueDate || "")} 
          onDelete={() => onDelete(item._id)} 
        />
      )}
      renderSectionHeader={({ section: { title, data, icon } }) => (
        data.length > 0 ? (
          <View style={styles.sectionHeaderRow}>
            <Feather name={icon} size={12} color="#8E8E93" />
            <Text style={styles.sectionHeader}>{title}</Text>
          </View>
        ) : null
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: { 
    paddingBottom: 120, 
    alignSelf: 'center', 
    width: '100%', 
    maxWidth: 600 
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8E8E93',
    marginLeft: 6,
    letterSpacing: 1,
  },
});

export default Task;