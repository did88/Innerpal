import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { APP_CONFIG } from '../config/app';

/**
 * Innerpal 기본 버튼 컴포넌트
 * @param {string} title - 버튼 텍스트
 * @param {function} onPress - 버튼 클릭 핸들러
 * @param {string} variant - 버튼 스타일 (primary, secondary, outline, ghost)
 * @param {string} size - 버튼 크기 (sm, md, lg)
 * @param {boolean} disabled - 비활성화 여부
 * @param {boolean} loading - 로딩 상태
 * @param {object} style - 추가 스타일
 */
export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false, 
  style,
  ...props 
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[`button_${size}`]];
    
    switch (variant) {
      case 'secondary':
        baseStyle.push(styles.buttonSecondary);
        break;
      case 'outline':
        baseStyle.push(styles.buttonOutline);
        break;
      case 'ghost':
        baseStyle.push(styles.buttonGhost);
        break;
      default:
        baseStyle.push(styles.buttonPrimary);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonDisabled);
    }
    
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText, styles[`buttonText_${size}`]];
    
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseStyle.push(styles.buttonTextOutline);
        break;
      default:
        baseStyle.push(styles.buttonTextSolid);
    }
    
    if (disabled || loading) {
      baseStyle.push(styles.buttonTextDisabled);
    }
    
    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.buttonContent}>
        {loading && (
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? APP_CONFIG.colors.primary : 'white'} 
            style={styles.buttonLoader}
          />
        )}
        <Text style={getTextStyle()}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Innerpal 카드 컴포넌트
 * @param {ReactNode} children - 카드 내용
 * @param {object} style - 추가 스타일
 * @param {boolean} shadow - 그림자 여부
 */
export const Card = ({ children, style, shadow = true, ...props }) => {
  return (
    <View 
      style={[
        styles.card, 
        shadow && APP_CONFIG.shadows.sm,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
};

/**
 * Innerpal 감정 뱃지 컴포넌트
 * @param {string} emotion - 감정 ID
 * @param {number} intensity - 감정 강도 (1-5)
 * @param {string} size - 크기 (sm, md, lg)
 */
export const EmotionBadge = ({ emotion, intensity = 3, size = 'md' }) => {
  const emotionConfig = APP_CONFIG.emotions?.find(e => e.id === emotion) || {
    name: '알 수 없음',
    color: APP_CONFIG.colors.textLight,
    emoji: '😐'
  };

  return (
    <View style={[
      styles.emotionBadge,
      styles[`emotionBadge_${size}`],
      { backgroundColor: emotionConfig.color + '20' } // 20% 투명도
    ]}>
      <Text style={[styles.emotionEmoji, styles[`emotionEmoji_${size}`]]}>
        {emotionConfig.emoji}
      </Text>
      <Text style={[styles.emotionText, styles[`emotionText_${size}`], { color: emotionConfig.color }]}>
        {emotionConfig.name}
      </Text>
      <View style={[styles.intensityDots]}>
        {[1, 2, 3, 4, 5].map(level => (
          <View
            key={level}
            style={[
              styles.intensityDot,
              {
                backgroundColor: level <= intensity 
                  ? emotionConfig.color 
                  : APP_CONFIG.colors.border
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Button 스타일
  button: {
    borderRadius: APP_CONFIG.borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button_sm: {
    paddingHorizontal: APP_CONFIG.spacing.md,
    paddingVertical: APP_CONFIG.spacing.sm,
    minHeight: 36,
  },
  button_md: {
    paddingHorizontal: APP_CONFIG.spacing.lg,
    paddingVertical: APP_CONFIG.spacing.md,
    minHeight: 48,
  },
  button_lg: {
    paddingHorizontal: APP_CONFIG.spacing.xl,
    paddingVertical: APP_CONFIG.spacing.lg,
    minHeight: 56,
  },
  buttonPrimary: {
    backgroundColor: APP_CONFIG.colors.primary,
  },
  buttonSecondary: {
    backgroundColor: APP_CONFIG.colors.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: APP_CONFIG.colors.primary,
  },
  buttonGhost: {
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    backgroundColor: APP_CONFIG.colors.border,
    borderColor: APP_CONFIG.colors.border,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoader: {
    marginRight: APP_CONFIG.spacing.sm,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonText_sm: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
  },
  buttonText_md: {
    fontSize: APP_CONFIG.fonts.sizes.md,
  },
  buttonText_lg: {
    fontSize: APP_CONFIG.fonts.sizes.lg,
  },
  buttonTextSolid: {
    color: 'white',
  },
  buttonTextOutline: {
    color: APP_CONFIG.colors.primary,
  },
  buttonTextDisabled: {
    color: APP_CONFIG.colors.textMuted,
  },

  // Card 스타일
  card: {
    backgroundColor: APP_CONFIG.colors.surface,
    borderRadius: APP_CONFIG.borderRadius.lg,
    padding: APP_CONFIG.spacing.lg,
    borderWidth: 1,
    borderColor: APP_CONFIG.colors.border,
  },

  // EmotionBadge 스타일
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: APP_CONFIG.borderRadius.full,
    paddingHorizontal: APP_CONFIG.spacing.md,
    paddingVertical: APP_CONFIG.spacing.sm,
  },
  emotionBadge_sm: {
    paddingHorizontal: APP_CONFIG.spacing.sm,
    paddingVertical: APP_CONFIG.spacing.xs,
  },
  emotionBadge_md: {
    paddingHorizontal: APP_CONFIG.spacing.md,
    paddingVertical: APP_CONFIG.spacing.sm,
  },
  emotionBadge_lg: {
    paddingHorizontal: APP_CONFIG.spacing.lg,
    paddingVertical: APP_CONFIG.spacing.md,
  },
  emotionEmoji: {
    marginRight: APP_CONFIG.spacing.xs,
  },
  emotionEmoji_sm: {
    fontSize: 14,
  },
  emotionEmoji_md: {
    fontSize: 16,
  },
  emotionEmoji_lg: {
    fontSize: 20,
  },
  emotionText: {
    fontWeight: '500',
    marginRight: APP_CONFIG.spacing.sm,
  },
  emotionText_sm: {
    fontSize: APP_CONFIG.fonts.sizes.xs,
  },
  emotionText_md: {
    fontSize: APP_CONFIG.fonts.sizes.sm,
  },
  emotionText_lg: {
    fontSize: APP_CONFIG.fonts.sizes.md,
  },
  intensityDots: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  intensityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});