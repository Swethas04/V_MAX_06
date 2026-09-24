import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../storage/hive_boxes.dart';

const String _baseUrl = 'http://10.0.2.2:3000/api/v1'; // localhost for Android emulator

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: _baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 30),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // JWT interceptor — attach token to every request
  dio.interceptors.add(
    InterceptorsWrapper(
      onRequest: (options, handler) {
        final token = HiveBoxes.auth.get('token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        return handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          // Clear auth state on 401
          HiveBoxes.auth.clear();
        }
        return handler.next(error);
      },
    ),
  );

  // Log interceptor in debug
  dio.interceptors.add(
    LogInterceptor(requestBody: true, responseBody: false, error: true),
  );

  return dio;
});
