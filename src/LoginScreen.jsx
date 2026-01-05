import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import auth from "@react-native-firebase/auth";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      navigation.replace("MainApp");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address");
      } else {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    console.log('Facebook login');
  };

  const handleSignup = () => {
    navigation.navigate('Signup');
  };

  const handleForgotPassword = () => {
    console.log('Navigate to forgot password');
  };

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const clearEmail = () => {
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#0A0A0A', '#1A1A1A', '#2A1B3D']}
        style={styles.gradientBackground}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
          {/* Logo at Top Center */}
          <View style={styles.logoContainer}>
            <Image
              source={require('./assets/DSLOGOnew.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Welcome Section */}
          <View style={styles.headerContainer}>
            <Text style={[styles.welcomeText, { fontSize: isSmallScreen ? 26 : 32 }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitleText, { fontSize: isSmallScreen ? 14 : 16 }]}>
              Sign in to continue your journey
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={[
                styles.inputLabel,
                { fontSize: isSmallScreen ? 11 : 12 }
              ]}>
                <Icon name="email-outline" size={isSmallScreen ? 12 : 14} color="#C81BD4" /> EMAIL
              </Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'email' && styles.inputContainerFocused,
                { height: isSmallScreen ? 48 : 56 }
              ]}>
                <TextInput
                  style={[
                    styles.input,
                    { fontSize: isSmallScreen ? 14 : 16 }
                  ]}
                  placeholder="you@example.com"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  // onFocus={() => setFocusedInput('email')}
                  // onBlur={() => setFocusedInput(null)}
                  // returnKeyType="next"
                  onSubmitEditing={() => {
                    // Focus on password field when "next" is pressed
                    passwordInputRef?.current?.focus();
                  }}
                />
                {/* {email.length > 0 && (
                  <TouchableOpacity 
                    onPress={clearEmail}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Icon name="close-circle" size={isSmallScreen ? 16 : 18} color="#666" />
                  </TouchableOpacity>
                )} */}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={[
                styles.inputLabel,
                { fontSize: isSmallScreen ? 11 : 12 }
              ]}>
                <Icon name="lock-outline" size={isSmallScreen ? 12 : 14} color="#C81BD4" /> PASSWORD
              </Text>
              <View style={[
                styles.inputContainer,
                focusedInput === 'password' && styles.inputContainerFocused,
                { height: isSmallScreen ? 48 : 56 }
              ]}>
                <TextInput
                  ref={passwordInputRef}
                  style={[
                    styles.input,
                    { fontSize: isSmallScreen ? 14 : 16, flex: 1 }
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                  // onFocus={() => setFocusedInput('password')}
                  // onBlur={() => setFocusedInput(null)}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity 
                  onPress={toggleSecureEntry}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Icon 
                    name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
                    size={isSmallScreen ? 18 : 20} 
                    color="#666" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity 
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { fontSize: isSmallScreen ? 13 : 14 }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity 
              style={[
                styles.loginButton, 
                loading && styles.loginButtonDisabled,
                { height: isSmallScreen ? 50 : 56 }
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#C81BD4', '#A316B0', '#8C1296']}
                style={styles.loginButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                {loading ? (
                  <View style={styles.loadingContainer}>
                    <Icon name="loading" size={isSmallScreen ? 16 : 18} color="#FFF" />
                    <Text style={[styles.loginButtonText, { fontSize: isSmallScreen ? 16 : 18 }]}>
                      Signing In...
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.loginButtonText, { fontSize: isSmallScreen ? 16 : 18 }]}>
                    Sign In
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { fontSize: isSmallScreen ? 13 : 14 }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={[styles.signupLink, { fontSize: isSmallScreen ? 13 : 14 }]}>
                  {' '}Create Account
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={[styles.dividerText, { fontSize: isSmallScreen ? 12 : 13 }]}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity 
                style={[
                  styles.socialButton,
                  styles.googleButton,
                  { paddingVertical: isSmallScreen ? 12 : 14 }
                ]}
                onPress={handleGoogleLogin}
                activeOpacity={0.8}
              >
                <Icon name="google" size={isSmallScreen ? 18 : 20} color="#DB4437" />
                <Text style={[
                  styles.socialButtonText,
                  { fontSize: isSmallScreen ? 14 : 15 }
                ]}>
                  Google
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[
                  styles.socialButton,
                  styles.facebookButton,
                  { paddingVertical: isSmallScreen ? 12 : 14 }
                ]}
                onPress={handleFacebookLogin}
                activeOpacity={0.8}
              >
                <Icon name="facebook" size={isSmallScreen ? 18 : 20} color="#4267B2" />
                <Text style={[
                  styles.socialButtonText,
                  { fontSize: isSmallScreen ? 14 : 15 }
                ]}>
                  Facebook
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerContainer}>
            <Text style={[styles.termsText, { fontSize: isSmallScreen ? 11 : 12 }]}>
              By signing in, you agree to our 
              <Text style={styles.termsLink}> Terms</Text> & <Text style={styles.termsLink}>Privacy</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Create ref for password input
const passwordInputRef = React.createRef();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  gradientBackground: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 15 : 20,
  },
  logo: {
    width: isSmallScreen ? 100 : 120,
    height: isSmallScreen ? 100 : 120,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 30,
  },
  welcomeText: {
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitleText: {
    color: '#999',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    padding: isSmallScreen ? 16 : 24,
    borderWidth: 1,
    borderColor: 'rgba(200, 27, 212, 0.1)',
    marginBottom: isSmallScreen ? 15 : 20,
  },
  inputWrapper: {
    marginBottom: isSmallScreen ? 15 : 20,
  },
  inputLabel: {
    fontWeight: '600',
    color: '#999',
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
  },
  inputContainerFocused: {
    borderColor: '#C81BD4',
    borderWidth: 2,
    shadowColor: '#C81BD4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  input: {
    color: '#FFF',
    paddingVertical: 0,
    paddingRight: 10,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: isSmallScreen ? 20 : 25,
    marginTop: -10,
  },
  forgotPasswordText: {
    color: '#C81BD4',
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: isSmallScreen ? 15 : 20,
  },
  loginButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  loginButtonText: {
    color: '#FFF',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: isSmallScreen ? 20 : 25,
  },
  signupText: {
    color: '#999',
  },
  signupLink: {
    color: '#C81BD4',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isSmallScreen ? 20 : 25,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 1,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(20, 20, 20, 0.7)',
    borderWidth: 1,
    borderColor: '#333',
  },
  googleButton: {
    borderColor: 'rgba(219, 68, 55, 0.3)',
  },
  facebookButton: {
    borderColor: 'rgba(66, 103, 178, 0.3)',
  },
  socialButtonText: {
    color: '#FFF',
    fontWeight: '500',
  },
  footerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: isSmallScreen ? 10 : 15,
  },
  termsText: {
    color: '#666',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 14 : 16,
  },
  termsLink: {
    color: '#C81BD4',
    fontWeight: '500',
  },
});

export default LoginScreen;