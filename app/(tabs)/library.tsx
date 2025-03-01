import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus, Upload, BookOpen, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Colors from '@/constants/Colors';
import { useLibraryStore } from '@/store/libraryStore';
import { DocumentCard } from '@/components/DocumentCard';
import { EmptyState } from '@/components/EmptyState';
import { Button } from '@/components/Button';

export default function LibraryScreen() {
  const router = useRouter();
  const { documents, addDocument, removeDocument } = useLibraryStore();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleUpload = async () => {
    if (Platform.OS === 'web') {
      // Web implementation would use a file input
      Alert.alert('Upload on Web', 'This feature is limited on web. In a full implementation, we would use a file input element.');
      
      // Simulate upload success
      simulateUploadSuccess();
      return;
    }
    
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'You need to grant permission to access your media library to upload documents.');
      return;
    }

    try {
        setIsUploading(true);
        
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: false,
          quality: 1,
        });
        
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const asset = result.assets[0];
          
          // In a real app, we would upload this to a server
          // For now, we'll just add it to our local store
          
          // Show document type selection dialog
          Alert.alert(
            'Document Type',
            'What type of document are you uploading?',
            [
              {
                text: 'Syllabus',
                onPress: () => {
                  const id = addDocument({
                    title: 'German Course Syllabus',
                    type: 'syllabus',
                    fileUrl: asset.uri,
                    thumbnail: asset.uri,
                  });
                  
                  // Generate questions for this document (simulated)
                  generateQuestionsForDocument(id);
                },
              },
              {
                text: 'Book',
                onPress: () => {
                  const id = addDocument({
                    title: 'German Language Book',
                    type: 'book',
                    fileUrl: asset.uri,
                    thumbnail: asset.uri,
                  });
                  
                  // Generate questions for this document (simulated)
                  generateQuestionsForDocument(id);
                },
              },
              {
                text: 'Notes',
                onPress: () => {
                  addDocument({
                    title: 'German Class Notes',
                    type: 'notes',
                    fileUrl: asset.uri,
                    thumbnail: asset.uri,
                  });
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]
          );
        }
      } catch (error) {
        console.error('Error uploading document:', error);
        Alert.alert('Upload Failed', 'There was an error uploading your document. Please try again.');
      } finally {
        setIsUploading(false);
      }
    };

    const simulateUploadSuccess = () => {
        // Create a mock document
        const documentTypes = ['syllabus', 'book', 'notes', 'other'] as const;
        const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
        
        const titles = {
          syllabus: 'German 101 Syllabus',
          book: 'Intermediate German Textbook',
          notes: 'Grammar Notes',
          other: 'German Vocabulary List',
        };
        
        const id = addDocument({
          title: titles[randomType],
          type: randomType,
          fileUrl: 'https://example.com/document.pdf',
          thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=3546&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        });
        
        // Generate questions for this document (simulated)
        if (randomType === 'syllabus' || randomType === 'book') {
          generateQuestionsForDocument(id);
        }
      };
      
      const generateQuestionsForDocument = (documentId: string) => {
        // In a real app, this would use AI to analyze the document and generate questions
        // For now, we'll just add some mock questions
        
        setTimeout(() => {
          const mockQuestions = [
            {
              text: 'What is the German word for "hello"?',
              options: ['Hallo', 'Tschüss', 'Danke', 'Bitte'],
              correctAnswer: 'Hallo',
            },
            {
              text: 'Which of these is a definite article in German?',
              options: ['ein', 'eine', 'der', 'mein'],
              correctAnswer: 'der',
            },
            {
              text: 'How do you say "thank you" in German?',
              options: ['Bitte', 'Danke', 'Entschuldigung', 'Willkommen'],
              correctAnswer: 'Danke',
            },
          ];
          
          // Add these questions to the document
          // In a real app, we would use the libraryStore to add these questions
          console.log('Generated questions for document:', documentId, mockQuestions);
        }, 2000);
      };

      const handleDocumentPress = (id: string) => {
        router.push(`/document/${id}`);
      };
      
      return (
        <SafeAreaView style={styles.container} edges={['top']}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Documents</Text>
            <Button
              title="Upload"
              onPress={handleUpload}
              leftIcon={<Upload size={16} color={Colors.card} />}
              loading={isUploading}
            />
          </View>
          
          {documents.length === 0 ? (
            <EmptyState
              icon={<BookOpen size={48} color={Colors.primary} />}
              title="No Documents Yet"
              description="Upload your German syllabi, books, or notes to get personalized questions and practice materials."
              actionLabel="Upload Document"
              onAction={handleUpload}
            />
          ) : (
            <FlatList
              data={documents}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DocumentCard
                  document={item}
                  onPress={() => handleDocumentPress(item.id)}
                  onDelete={() => removeDocument(item.id)}
                />
              )}
              contentContainerStyle={styles.documentsList}
            />
          )}

<View style={styles.uploadSection}>
        <View style={styles.uploadTypes}>
          <TouchableOpacity 
            style={styles.uploadTypeItem}
            onPress={handleUpload}
          >
            <View style={styles.uploadTypeIcon}>
              <FileText size={24} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTypeText}>Syllabus</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadTypeItem}
            onPress={handleUpload}
          >
            <View style={styles.uploadTypeIcon}>
              <BookOpen size={24} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTypeText}>Book</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.uploadTypeItem}
            onPress={handleUpload}
          >
            <View style={styles.uploadTypeIcon}>
              <Plus size={24} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTypeText}>Other</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.uploadNote}>
          Upload your learning materials to get AI-generated questions and personalized practice exercises.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: Colors.text,
    },
    documentsList: {
      padding: 16,
    },
    uploadSection: {
      padding: 16,
      backgroundColor: Colors.card,
      borderTopWidth: 1,
      borderTopColor: Colors.border,
    },
    uploadTypes: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    uploadTypeItem: {
      alignItems: 'center',
    },
    uploadTypeIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        borderWidth: 1,
        borderColor: Colors.border,
      },
      uploadTypeText: {
        fontSize: 12,
        color: Colors.text,
      },
      uploadNote: {
        fontSize: 12,
        color: Colors.textLight,
        textAlign: 'center',
      },
    });