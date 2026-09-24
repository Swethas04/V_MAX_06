import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';

class AuthRepository {
  final Dio _dio;
  AuthRepository(this._dio);

  Future<Map<String, dynamic>> sendOtp(String phone) async {
    final response = await _dio.post(
      '/auth/send-otp',
      data: {'phone': phone},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> verifyOtp(String phone, String otp) async {
    final response = await _dio.post(
      '/auth/verify-otp',
      data: {
        'phone': phone,
        'otp': otp,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> selectRole(String role) async {
    final response = await _dio.post(
      '/auth/select-role',
      data: {'role': role},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getMe() async {
    final response = await _dio.get('/auth/me');
    return response.data as Map<String, dynamic>;
  }
}

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(ref.watch(dioProvider));
});
