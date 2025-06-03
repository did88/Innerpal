16, marginTop: 8, alignSelf: 'flex-start',
  },
  cbtSuggestionText: { color: 'white', fontSize: 14, fontWeight: '500' },
  loadingContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16,
  },
  loadingText: { marginLeft: 8, fontSize: 14, color: APP_CONFIG.colors.textLight, fontStyle: 'italic' },
  emotionTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  emotionEmoji: { fontSize: 16, marginRight: 6 },
  emotionText: { fontSize: 14, fontWeight: '500', marginRight: 8 },
  intensityDots: { flexDirection: 'row' },
  intensityDot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 1 },
  inputContainer: {
    flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: APP_CONFIG.colors.surface, borderTopWidth: 1, borderTopColor: APP_CONFIG.colors.border,
    alignItems: 'flex-end', paddingBottom: Platform.OS === 'ios' ? 34 : 12,
  },
  textInput: {
    flex: 1, borderWidth: 1, borderColor: APP_CONFIG.colors.border, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 12, marginRight: 12, fontSize: 16,
    color: APP_CONFIG.colors.text, backgroundColor: APP_CONFIG.colors.background, maxHeight: 100,
  },
  sendButton: {
    backgroundColor: APP_CONFIG.colors.primary, paddingHorizontal: 20, paddingVertical: 12,
    borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  sendButtonDisabled: { backgroundColor: APP_CONFIG.colors.border },
  sendButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});

export default InnerTalkScreen;