    fontWeight: '500',
    color: APP_CONFIG.colors.text,
  },

  // 강도 선택
  intensityContainer: {
    alignItems: 'center',
  },
  intensityScale: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  intensityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: APP_CONFIG.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  intensityText: {
    fontSize: 18,
    fontWeight: '600',
    color: APP_CONFIG.colors.textLight,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  intensityLabel: {
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
  },

  // 텍스트 입력
  textInput: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: APP_CONFIG.colors.text,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
    minHeight: 120,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: APP_CONFIG.colors.textMuted,
    marginTop: 8,
  },

  // 태그
  tagsContainer: {
    marginTop: 8,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  situationTag: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
  },
  selectedTag: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderColor: APP_CONFIG.colors.primary,
  },
  tagText: {
    fontSize: 14,
    color: APP_CONFIG.colors.text,
  },
  selectedTagText: {
    color: 'white',
    fontWeight: '500',
  },

  // 제출 버튼
  submitContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  submitButton: {
    backgroundColor: APP_CONFIG.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: APP_CONFIG.colors.border,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyNote: {
    textAlign: 'center',
    fontSize: 14,
    color: APP_CONFIG.colors.textLight,
    marginTop: 16,
  },
  processingNote: {
    textAlign: 'center',
    fontSize: 14,
    color: APP_CONFIG.colors.secondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default EmotionInputScreen;