import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';

class TeamsRepository {
  final Dio _dio;
  TeamsRepository(this._dio);

  Future<List<dynamic>> getMyTeams() async {
    final response = await _dio.get('/teams/my');
    return response.data as List<dynamic>;
  }

  Future<Map<String, dynamic>> getTeamKanban(String teamId) async {
    final response = await _dio.get('/teams/$teamId/kanban');
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> createTeam({
    required String name,
    required String problemId,
    required String facultyMentorId,
    List<String>? studentIds,
  }) async {
    final response = await _dio.post(
      '/teams',
      data: {
        'name': name,
        'problemId': problemId,
        'facultyMentorId': facultyMentorId,
        'studentIds': studentIds ?? [],
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> addMilestone({
    required String teamId,
    required String title,
    String? description,
    String? dueDate,
  }) async {
    final response = await _dio.post(
      '/teams/$teamId/milestones',
      data: {
        'title': title,
        'description': description,
        'dueDate': dueDate,
      },
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> updateMilestoneStatus({
    required String teamId,
    required String milestoneId,
    required String status,
  }) async {
    final response = await _dio.patch(
      '/teams/$teamId/milestones/$milestoneId',
      data: {'status': status},
    );
    return response.data as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> submitIndustryOffer({
    required String teamId,
    required String partnerName,
    required double offerAmount,
    required String offerType,
    String? message,
  }) async {
    final response = await _dio.post(
      '/teams/$teamId/industry-offer',
      data: {
        'partnerName': partnerName,
        'offerAmount': offerAmount,
        'offerType': offerType,
        'message': message,
      },
    );
    return response.data as Map<String, dynamic>;
  }
}

final teamsRepositoryProvider = Provider<TeamsRepository>((ref) {
  return TeamsRepository(ref.watch(dioProvider));
});
