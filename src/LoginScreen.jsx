import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handle login logic here
    // console.log('Login attempted with:', { email, password });
    navigation.navigate("MainApp");
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login');
  };

  const handleFacebookLogin = () => {
    // Handle Facebook login
    console.log('Facebook login');
  };

  const handleSignup = () => {
    // Navigate to signup screen
    navigation.navigate('Signup')
  };

  const handleForgotPassword = () => {
    // Navigate to forgot password screen
    console.log('Navigate to forgot password');
  };

  return (

    <SafeAreaView style={styles.safeArea}>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Header/Title could be added here if needed */}
            <Image
              style={styles.logo}
              source={require('./assets/DSLOGOnew.png')}
            />

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>New User ? </Text>
              <TouchableOpacity onPress={handleSignup}>
                <Text style={styles.signupLink}>Signup</Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
              <View style={styles.socialButtonContent}>
                {/* Replace with actual Google icon */}
                <View style={[styles.socialIcon, { backgroundColor: '#DB4437' }]} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, styles.facebookButton]} onPress={handleFacebookLogin}>
              <View style={styles.socialButtonContent}>
                {/* Replace with actual Facebook icon */}
                <View style={[styles.socialIcon, { backgroundColor: '#4267B2' }]} />
                <Text style={styles.socialButtonText}>Continue with Facebook</Text>
              </View>
            </TouchableOpacity>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Need help Forgot Password ?</Text>
            </TouchableOpacity>

            {/* Terms & Conditions */}
            <Text style={styles.termsText}>
              By signing in, you agree to our Terms & Conditions
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  logo: {
    width: 100,
    height: 100,
    marginLeft: 130,
    marginBottom: 8,
    resizeMode: "contain",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
    justifyContent: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#c81bd4ff',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
    width:100,
    justifyContent:'center',
    alignItems:'center',
    margin:130

  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    fontSize: 14,
    color: '#c81bd4ff',
    fontWeight: '600',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    // backgroundColor: '#eee',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#999',
    fontSize: 14,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#c81bd4ff',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 12,
  },
  facebookButton: {
    marginBottom: 24,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  termsText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#999',
    lineHeight: 18,
  },
});

export default LoginScreen;