import 'dart:io';
import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';

class ProblemsRepository {
  final Dio _dio;
  ProblemsRepository(this._dio);

  Future<Map<String, dynamic>> submitProblem({
    required String title,
    required String description,
    required String category,
    double? latitude,
    double? longitude,
    String? address,
    String? district,
    String? state,
    List<String>? tags,
    String language = 'en',
    File? voiceNote,
    List<File>? mediaFiles,
  }) async {
    final formData = FormData();

    formData.fields.addAll([
      MapEntry('title', title),
      MapEntry('description', description),
      MapEntry('category', category),
      if (latitude != null) MapEntry('latitude', latitude.toString()),
      if (longitude != null) MapEntry('longitude', longitude.toString()),
      if (address != null) MapEntry('address', address),
      if (district != null) MapEntry('district', district),
      if (state != null) MapEntry('state', state),
      if (tags != null && tags.isNotEmpty) MapEntry('tags', tags.join(',')),
      MapEntry('language', language),
    ]);

    if (voiceNote != null && await voiceNote.exists()) {
      formData.files.add(
        MapEntry(
          'voiceNote',
          await MultipartFile.fromFile(
            voiceNote.path,
            filename: voiceNote.path.split('/').last.split('\\').last,
          ),
        ),
      );
    }

    if (mediaFiles != null) {
      for (final file in mediaFiles) {
        if (await file.exists()) {
          formData.files.add(
            MapEntry(
              'mediaFiles',
              await MultipartFile.fromFile(
                file.path,
                filename: file.path.split('/').last.split('\\').last,
              ),
            ),
          );
        }
      }
    }

    final response = await _dio.post(
      '/problems',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );

    return response.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getMySubmissions() async {
    final response = await _dio.get('/problems/my');
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> getAllProblems({
    String? category,
    String? status,
    String? district,
    String? search,
    int page = 1,
    int limit = 20,
  }) async {
    final query = <String, dynamic>{
      'page': page,
      'limit': limit,
    };
    if (category != null && category.isNotEmpty) query['category'] = category;
    if (status != null && status.isNotEmpty) query['status'] = status;
    if (district != null && district.isNotEmpty) query['district'] = district;
    if (search != null && search.isNotEmpty) query['search'] = search;

    final response = await _dio.get('/problems', queryParameters: query);
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> getProblemById(String id) async {
    final response = await _dio.get('/problems/$id');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> upvoteProblem(String id) async {
    final response = await _dio.post('/problems/$id/upvote');
    return response.data as Map<String, dynamic>;
  }

  Future<List<dynamic>> getSimilarProblems(String query) async {
    if (query.trim().isEmpty) return [];
    final response = await _dio.get(
      '/problems/similar',
      queryParameters: {'q': query},
    );
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> checkSimilar({
    required String title,
    String? description,
    double? latitude,
    double? longitude,
    double radiusKm = 50,
    double threshold = 0.85,
    String? district,
  }) async {
    final response = await _dio.post(
      '/problems/check-similar',
      data: {
        'title': title,
        if (description != null && description.isNotEmpty) 'description': description,
        if (latitude != null) 'latitude': latitude,
        if (longitude != null) 'longitude': longitude,
        'radiusKm': radiusKm,
        'threshold': threshold,
        if (district != null) 'district': district,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> supportProblem({
    required String problemId,
    String? message,
    List<File>? mediaFiles,
  }) async {
    final formData = FormData();
    if (message != null && message.isNotEmpty) {
      formData.fields.add(MapEntry('message', message));
    }
    if (mediaFiles != null) {
      for (final file in mediaFiles) {
        if (await file.exists()) {
          formData.files.add(
            MapEntry(
              'files',
              await MultipartFile.fromFile(
                file.path,
                filename: file.path.split('/').last.split('\\').last,
              ),
            ),
          );
        }
      }
    }
    final response = await _dio.post(
      '/problems/$problemId/support',
      data: formData,
      options: Options(contentType: 'multipart/form-data'),
    );
    return response.data as Map<String, dynamic>;
  }
}

final problemsRepositoryProvider = Provider<ProblemsRepository>((ref) {
  return ProblemsRepository(ref.watch(dioProvider));
});
