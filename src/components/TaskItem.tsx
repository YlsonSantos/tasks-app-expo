import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
  text: string;
  completed?: boolean;
  dueDate?: string;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ text, completed, dueDate, onEdit, onToggle, onDelete }) => {
  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <Pressable 
        onPress={onToggle}
        style={({ pressed }) => [
          styles.checkCircle,
          { backgroundColor: completed ? '#007AFF' : 'transparent', opacity: pressed ? 0.7 : 1 }
        ]}
      >
        {completed && <Feather name="check" size={14} color="#fff" />}
      </Pressable>

      <View style={styles.textContainer}>
        <Text style={[styles.text, completed && styles.textCompleted]}>
          {text}
        </Text>
        {dueDate && (
          <View style={styles.dateRow}>
            <Feather name="calendar" size={12} color="#8E8E93" />
            <Text style={styles.dateText}> {dueDate}</Text>
          </View>
        )}
      </View>

      <View style={styles.actionButtons}>
        <Pressable 
          onPress={onEdit}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
        >
          <Feather name="edit-2" size={18} color="#007AFF" />
        </Pressable>

        <Pressable 
          onPress={onDelete}
          style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.5 }]}
        >
          <AntDesign name="delete" size={18} color="#C7C7CC" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    color: '#8E8E93',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
});