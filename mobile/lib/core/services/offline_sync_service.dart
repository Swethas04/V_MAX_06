import 'dart:convert';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../storage/hive_boxes.dart';
import '../../features/citizen/repositories/problems_repository.dart';

class OfflineSyncState {
  final bool isOnline;
  final int pendingCount;
  final bool isSyncing;
  final String? lastSyncMessage;

  const OfflineSyncState({
    this.isOnline = true,
    this.pendingCount = 0,
    this.isSyncing = false,
    this.lastSyncMessage,
  });

  OfflineSyncState copyWith({
    bool? isOnline,
    int? pendingCount,
    bool? isSyncing,
    String? lastSyncMessage,
  }) =>
      OfflineSyncState(
        isOnline: isOnline ?? this.isOnline,
        pendingCount: pendingCount ?? this.pendingCount,
        isSyncing: isSyncing ?? this.isSyncing,
        lastSyncMessage: lastSyncMessage ?? this.lastSyncMessage,
      );
}

class OfflineSyncNotifier extends StateNotifier<OfflineSyncState> {
  final ProblemsRepository _repository;

  OfflineSyncNotifier(this._repository) : super(const OfflineSyncState()) {
    _init();
  }

  void _init() {
    _updatePendingCount();
    Connectivity().onConnectivityChanged.listen((results) {
      final hasConnection = results.any((r) => r != ConnectivityResult.none);
      state = state.copyWith(isOnline: hasConnection);
      if (hasConnection && HiveBoxes.offlineQueue.isNotEmpty) {
        flushQueue();
      }
    });
  }

  void _updatePendingCount() {
    state = state.copyWith(pendingCount: HiveBoxes.offlineQueue.length);
  }

  Future<void> queueSubmission(Map<String, dynamic> data) async {
    final key = 'sub_${DateTime.now().millisecondsSinceEpoch}';
    await HiveBoxes.offlineQueue.put(key, jsonEncode(data));
    _updatePendingCount();
  }

  Future<void> flushQueue() async {
    if (state.isSyncing || HiveBoxes.offlineQueue.isEmpty) return;

    state = state.copyWith(isSyncing: true);
    int successCount = 0;

    final keys = HiveBoxes.offlineQueue.keys.toList();
    for (final key in keys) {
      try {
        final raw = HiveBoxes.offlineQueue.get(key);
        if (raw != null) {
          final data = jsonDecode(raw.toString()) as Map<String, dynamic>;
          await _repository.submitProblem(
            title: data['title'] ?? '',
            description: data['description'] ?? '',
            category: data['category'] ?? 'other',
            latitude: data['latitude'] != null ? (data['latitude'] as num).toDouble() : null,
            longitude: data['longitude'] != null ? (data['longitude'] as num).toDouble() : null,
            address: data['address'],
            district: data['district'],
            state: data['state'],
            tags: (data['tags'] as List?)?.cast<String>(),
          );
          await HiveBoxes.offlineQueue.delete(key);
          successCount++;
        }
      } catch (e) {
        // If it fails (e.g. backend still down), keep in queue
        break;
      }
    }

    _updatePendingCount();
    state = state.copyWith(
      isSyncing: false,
      lastSyncMessage: successCount > 0 ? 'Synced $successCount problems!' : null,
    );
  }
}

final offlineSyncProvider =
    StateNotifierProvider<OfflineSyncNotifier, OfflineSyncState>((ref) {
  return OfflineSyncNotifier(ref.watch(problemsRepositoryProvider));
});
