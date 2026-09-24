import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/storage/hive_boxes.dart';

class AuthState {
  final String? token;
  final String? role;
  final String? userId;
  final String? name;
  final bool isLoading;
  final String? error;

  const AuthState({
    this.token,
    this.role,
    this.userId,
    this.name,
    this.isLoading = false,
    this.error,
  });

  AuthState copyWith({
    String? token,
    String? role,
    String? userId,
    String? name,
    bool? isLoading,
    String? error,
  }) =>
      AuthState(
        token: token ?? this.token,
        role: role ?? this.role,
        userId: userId ?? this.userId,
        name: name ?? this.name,
        isLoading: isLoading ?? this.isLoading,
        error: error ?? this.error,
      );
}

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier() : super(const AuthState()) {
    _loadFromStorage();
  }

  void _loadFromStorage() {
    final token = HiveBoxes.auth.get('token');
    final role = HiveBoxes.auth.get('role');
    final userId = HiveBoxes.auth.get('userId');
    final name = HiveBoxes.auth.get('name');
    if (token != null) {
      state = AuthState(token: token, role: role, userId: userId, name: name);
    }
  }

  void setAuth({
    required String token,
    required String role,
    required String userId,
    required String name,
  }) {
    HiveBoxes.auth.put('token', token);
    HiveBoxes.auth.put('role', role);
    HiveBoxes.auth.put('userId', userId);
    HiveBoxes.auth.put('name', name);
    state = AuthState(token: token, role: role, userId: userId, name: name);
  }

  void setRole(String role) {
    HiveBoxes.auth.put('role', role);
    state = state.copyWith(role: role);
  }

  void logout() {
    HiveBoxes.auth.clear();
    state = const AuthState();
  }

  void setError(String error) {
    state = state.copyWith(isLoading: false, error: error);
  }

  void setLoading(bool loading) {
    state = state.copyWith(isLoading: loading, error: null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>(
  (ref) => AuthNotifier(),
);
