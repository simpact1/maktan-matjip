import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

interface Props {
  children: React.ReactNode;
  /** 자식 구성이 바뀌면(예: 야시장↔맛집 전환) 에러 상태를 초기화하기 위한 키 */
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
}

/**
 * 지도(react-leaflet 등) 렌더 중 예외가 발생해도 앱 전체가 하얀 화면으로
 * 죽지 않도록 막는 에러 경계. 에러 시 안내와 '다시 시도' 버튼만 보여주고,
 * 리스트·후기 링크 등 나머지 UI는 정상 동작한다.
 */
export class MapErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <Text style={styles.text}>
            지도를 표시하는 중 문제가 발생했어요. 목록과 후기 보기는 그대로 이용할 수 있습니다.
          </Text>
          <Pressable
            onPress={this.handleRetry}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            accessibilityRole="button"
            accessibilityLabel="지도 다시 시도"
          >
            <Text style={styles.buttonText}>지도 다시 시도</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    gap: 12,
  },
  text: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#0c4a60',
    borderWidth: 1,
    borderColor: '#176a84',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: '#ffffff',
  },
});
