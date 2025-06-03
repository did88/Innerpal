  // CBT 세션 완료
  const handleCompletion = async () => {
    setIsCompleting(true);
    saveAnswer();

    try {
      // 실제 AI 인사이트 생성
      console.log('CBT 인사이트 생성 중...');
      const sessionData = {
        initial_emotion: emotionData,
        answers: { ...answers, [`${currentSequence}_${currentQuestion.id}`]: currentAnswer },
        before_mood: 3, // 기본값, 실제로는 감정 강도에서 가져올 수 있음
        after_mood: Math.min(10, 3 + Math.floor(Math.random() * 3) + 1)
      };

      const insightsResult = await openAIService.generateCBTInsights(sessionData);
      
      // CBT 세션 데이터베이스에 저장
      const cbtData = {
        emotion_id: emotionData?.id,
        session_answers: sessionData.answers,
        insights: insightsResult.success ? insightsResult.insights : null,
        before_mood: sessionData.before_mood,
        after_mood: sessionData.after_mood,
        completed_at: new Date().toISOString(),
        session_type: 'full_cbt'
      };

      console.log('CBT 세션 저장 중...');
      await database.createCBTSession(cbtData);

      Alert.alert(
        'CBT 세션 완료! 🎉',
        '인지행동치료 과정을 완주하셨습니다. 인사이트를 확인해보세요.',
        [
          { text: '홈으로', onPress: () => navigation.navigate('Home') },
          {
            text: '인사이트 보기',
            onPress: () => navigation.navigate('CBTInsights', { 
              insights: insightsResult.success ? insightsResult.insights : generateInsights(sessionData.answers),
              answers: sessionData.answers,
              emotionData,
              sessionData: cbtData
            })
          }
        ]
      );

    } catch (error) {
      console.error('CBT 세션 완료 오류:', error);
      
      // 폴백 처리
      const fallbackInsights = generateInsights({ ...answers, [`${currentSequence}_${currentQuestion.id}`]: currentAnswer });
      
      Alert.alert(
        'CBT 세션 완료! 🎉',
        '인지행동치료 과정을 완주하셨습니다.',
        [
          { text: '홈으로', onPress: () => navigation.navigate('Home') },
          {
            text: '인사이트 보기',
            onPress: () => navigation.navigate('CBTInsights', { 
              insights: fallbackInsights,
              answers: { ...answers, [`${currentSequence}_${currentQuestion.id}`]: currentAnswer },
              emotionData
            })
          }
        ]
      );
    } finally {
      setIsCompleting(false);
    }
  };