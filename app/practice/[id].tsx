import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { usePracticeStore } from '@/store/practiceStore';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function PracticeSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getSession, completeSession } = usePracticeStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const session = getSession(id);
  
  useEffect(() => {
    if (!session) {
      router.replace('/practice');
    } else if (session.completed) {
      setShowResults(true);
    }
  }, [session, router]);
  
  if (!session) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  const currentQuestion = session.questions[currentQuestionIndex];
  
  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    
    setSelectedOption(option);
    setIsAnswered(true);
    
    if (option === currentQuestion.correctAnswer) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < session.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // End of session
      const score = Math.round((correctAnswers / session.questions.length) * 100);
      completeSession(session.id, score);
      setShowResults(true);
    }
  };

  const renderResultsScreen = () => {
    const score = session.score || Math.round((correctAnswers / session.questions.length) * 100);
    
    return (
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <Award size={48} color={Colors.primary} />
            <Text style={styles.resultsTitle}>Practice Complete!</Text>
          </View>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Your Score</Text>
            <Text style={styles.scoreValue}>{score}%</Text>
            <View style={styles.scoreBar}>
              <View 
                style={[
                  styles.scoreProgress, 
                  { width: `${score}%` },
                  score < 50 ? styles.scoreLow : score < 80 ? styles.scoreMedium : styles.scoreHigh
                ]} 
              />
            </View>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session.questions.length}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{correctAnswers}</Text>
              <Text style={styles.statLabel}>Correct</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{session.questions.length - correctAnswers}</Text>
              <Text style={styles.statLabel}>Incorrect</Text>
            </View>
          </View>
          
          <Button
            title="Back to Practice"
            onPress={() => router.replace('/practice')}
            style={styles.backButton}
          />
        </Card>
        
        <Text style={styles.reviewTitle}>Review Questions</Text>

        {session.questions.map((question, index) => (
          <Card key={index} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.reviewQuestionNumber}>Question {index + 1}</Text>
              {session.completed ? (
                question.correctAnswer === session.questions[index].correctAnswer ? (
                  <CheckCircle size={20} color={Colors.success} />
                ) : (
                  <XCircle size={20} color={Colors.error} />
                )
              ) : null}
            </View>
            
            <Text style={styles.reviewQuestionText}>{question.text}</Text>
            
            <View style={styles.reviewOptionsContainer}>
              {question.options?.map((option, optionIndex) => (
                <View 
                  key={optionIndex} 
                  style={[
                    styles.reviewOptionItem,
                    option === question.correctAnswer && styles.correctOption,
                    session.completed && option !== question.correctAnswer && styles.incorrectOption
                  ]}
                >
                  <Text 
                    style={[
                      styles.reviewOptionText,
                      option === question.correctAnswer && styles.correctOptionText,
                      session.completed && option !== question.correctAnswer && styles.incorrectOptionText
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>
    );
  };

  const renderQuestionScreen = () => {
    return (
      <View style={styles.questionContainer}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestionIndex + 1) / session.questions.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {session.questions.length}
          </Text>
        </View>
        
        <ScrollView style={styles.questionScrollView}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionItem,
                  selectedOption === option && styles.selectedOption,
                  isAnswered && option === currentQuestion.correctAnswer && styles.correctOption,
                  isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && styles.incorrectOption
                ]}
                onPress={() => handleSelectOption(option)}
                disabled={isAnswered}
              >
                <Text 
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText,
                    isAnswered && option === currentQuestion.correctAnswer && styles.correctOptionText,
                    isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && styles.incorrectOptionText
                  ]}
                >
                  {option}
                </Text>
                
                {isAnswered && option === currentQuestion.correctAnswer && (
                  <CheckCircle size={20} color={Colors.success} />
                )}
                
                {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && (
                  <XCircle size={20} color={Colors.error} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {isAnswered && (
          <View style={styles.feedbackContainer}>
            <Text style={[
              styles.feedbackText,
              selectedOption === currentQuestion.correctAnswer ? styles.correctFeedbackText : styles.incorrectFeedbackText
            ]}>
              {selectedOption === currentQuestion.correctAnswer 
                ? 'Correct! Well done.' 
                : `Incorrect. The correct answer is "${currentQuestion.correctAnswer}".`}
            </Text>
            
            <Button
              title={currentQuestionIndex < session.questions.length - 1 ? "Next Question" : "See Results"}
              onPress={handleNextQuestion}
              rightIcon={<ArrowRight size={16} color={Colors.card} />}
              style={styles.nextButton}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen 
        options={{
          title: session.title,
        }}
      />
      
      {showResults ? renderResultsScreen() : renderQuestionScreen()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionContainer: {
      flex: 1,
      padding: 16,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    progressBar: {
      flex: 1,
      height: 8,
      backgroundColor: Colors.border,
      borderRadius: 4,
      marginRight: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: Colors.primary,
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      color: Colors.textLight,
      minWidth: 40,
      textAlign: 'right',
    },
    questionScrollView: {
      flex: 1,
    },
    questionText: {
      fontSize: 20,
      fontWeight: '600',
      color: Colors.text,
      marginBottom: 24,
    },
    optionsContainer: {
      gap: 12,
    },
    optionItem: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      selectedOption: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primary + '10', // 10% opacity
      },
      correctOption: {
        borderColor: Colors.success,
        backgroundColor: Colors.success + '10', // 10% opacity
      },
      incorrectOption: {
        borderColor: Colors.error,
        backgroundColor: Colors.error + '10', // 10% opacity
      },
      optionText: {
        fontSize: 16,
        color: Colors.text,
      },
      selectedOptionText: {
        color: Colors.primary,
        fontWeight: '500',
      },
      correctOptionText: {
        color: Colors.success,
        fontWeight: '500',
      },
      incorrectOptionText: {
        color: Colors.error,
        fontWeight: '500',
      },
      feedbackContainer: {
        padding: 16,
        backgroundColor: Colors.card,
        borderRadius: 8,
        marginTop: 16,
      },
      feedbackText: {
        fontSize: 16,
        marginBottom: 16,
      },
      correctFeedbackText: {
        color: Colors.success,
      },
      incorrectFeedbackText: {
        color: Colors.error,
      },
      nextButton: {
        width: '100%',
      },
      scrollView: {
        flex: 1,
      },
      scrollContent: {
        padding: 16,
        paddingBottom: 32,
      },
      resultsCard: {
        marginBottom: 24,
      },
      resultsHeader: {
        alignItems: 'center',
        marginBottom: 24,
      },
      resultsTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginTop: 16,
      },
      scoreContainer: {
        alignItems: 'center',
        marginBottom: 24,
      },
      scoreLabel: {
        fontSize: 16,
        color: Colors.textLight,
        marginBottom: 8,
      },
      scoreValue: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 16,
      },
      scoreBar: {
        width: '100%',
        height: 12,
        backgroundColor: Colors.border,
        borderRadius: 6,
        overflow: 'hidden',
      },
      scoreProgress: {
        height: '100%',
        borderRadius: 6,
      },
      scoreLow: {
        backgroundColor: Colors.error,
      },
      scoreMedium: {
        backgroundColor: Colors.warning,
      },
      scoreHigh: {
        backgroundColor: Colors.success,
      },
      statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 24,
      },
      statItem: {
        alignItems: 'center',
      },
      statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 4,
      },
      statLabel: {
        fontSize: 14,
        color: Colors.textLight,
      },
      backButton: {
        width: '100%',
      },
      reviewTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: 16,
      },
      reviewCard: {
        marginBottom: 16,
      },
      reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      },
      reviewQuestionNumber: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text,
      },
      reviewQuestionText: {
        fontSize: 16,
        color: Colors.text,
        marginBottom: 16,
      },
      reviewOptionsContainer: {
        gap: 8,
      },
      reviewOptionItem: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
      },
      reviewOptionText: {
        fontSize: 14,
        color: Colors.text,
      },
    });