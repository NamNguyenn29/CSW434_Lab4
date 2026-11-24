import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = [
  '#BDF5C8',
  '#C7C9FF',
  '#F8BFCF',
  '#FFF2B8',
  '#AEEFEA',
  '#F4C5F5',
];

export default function NoteCard({ note, index, onPress, onLongPress }) {
  const title = note.title || 'Untitled';
  const content = note.content || note.text || '';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: COLORS[index % COLORS.length] }]}
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      <Text style={styles.content} numberOfLines={7}>
        {content}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    minHeight: 135,
    borderRadius: 13,
    padding: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#555',
    textAlign: 'center',
    marginBottom: 7,
  },
  content: {
    fontSize: 11,
    lineHeight: 15,
    color: '#777',
    textAlign: 'center',
  },
});
