import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FileText, Book, FileQuestion, Trash2 } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Document } from '@/types';

interface DocumentCardProps {
  document: Document;
  onPress: () => void;
  onDelete?: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onPress,
  onDelete,
}) => {
  const getIcon = () => {
    switch (document.type) {
      case 'syllabus':
        return <FileText size={24} color={Colors.primary} />;
      case 'book':
        return <Book size={24} color={Colors.primary} />;
      default:
        return <FileText size={24} color={Colors.primary} />;
    }
  };

  const hasQuestions = document.questions && document.questions.length > 0;

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {document.thumbnail ? (
          <Image 
            source={{ uri: document.thumbnail }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        ) : (
          getIcon()
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {document.title}
        </Text>
        <Text style={styles.details}>
          {document.type.charAt(0).toUpperCase() + document.type.slice(1)} • {new Date(document.uploadedAt).toLocaleDateString()}
        </Text>
        
        {hasQuestions && (
          <View style={styles.questionsContainer}>
            <FileQuestion size={14} color={Colors.success} />
            <Text style={styles.questionsText}>
              {document.questions?.length} questions available
            </Text>
          </View>
        )}
      </View>

      {onDelete && (
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={onDelete}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Trash2 size={18} color={Colors.error} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  details: {
    fontSize: 12,
    color: Colors.textLight,
    marginBottom: 4,
  },
  questionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionsText: {
    fontSize: 12,
    color: Colors.success,
    marginLeft: 4,
  },
  deleteButton: {
    padding: 4,
  },
});