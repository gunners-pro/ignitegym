import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, Text, VStack } from '@gluestack-ui/themed';
import { useState } from 'react';
import { SectionList } from 'react-native';

export function History() {
  const [exercises, setExercises] = useState([
    {
      title: '08.11.2024',
      data: ['Puxada frontal', 'Remada unilateral'],
    },
    {
      title: '09.11.2024',
      data: ['Rosca direta'],
    },
  ]);

  return (
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      <SectionList
        sections={exercises}
        keyExtractor={(item) => item}
        renderItem={() => <HistoryCard />}
        renderSectionHeader={({ section }) => (
          <Heading
            color="$gray200"
            fontSize="$md"
            mt="$10"
            mb="$3"
            fontFamily="$heading"
          >
            {section.title}
          </Heading>
        )}
        style={{ paddingHorizontal: 32 }}
        contentContainerStyle={
          exercises.length === 0 && { flex: 1, justifyContent: 'center' }
        }
        ListEmptyComponent={EmptySection}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}

const EmptySection = () => (
  <Text color="$gray100" textAlign="center">
    Não há exercícios registrados ainda. {'\n'} Vamos fazer exercícios hoje ?
  </Text>
);
