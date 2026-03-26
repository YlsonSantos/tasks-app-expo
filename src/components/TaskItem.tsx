import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskItemProps {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ text, onEdit, onDelete }) => {
  return (
    <View style={styles.todo}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.icons}>
        <TouchableOpacity onPress={onEdit}>
          <Feather name="edit" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete}>
          <AntDesign name="delete" size={20} color="#fff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  todo: {
    backgroundColor: '#000',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  icons: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 16,
  },
  icon: {
    padding: 2,
  },
});
