import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/services/offline_sync_service.dart';
import '../../../shared/widgets/offline_banner_widget.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../shared/widgets/problem_card_widget.dart';
import '../../auth/providers/auth_provider.dart';
import '../repositories/problems_repository.dart';

class CitizenHomeScreen extends ConsumerStatefulWidget {
  const CitizenHomeScreen({super.key});

  @override
  ConsumerState<CitizenHomeScreen> createState() => _CitizenHomeScreenState();
}

class _CitizenHomeScreenState extends ConsumerState<CitizenHomeScreen> {
  String? _selectedCategory;
  String _searchQuery = '';
  final _searchController = TextEditingController();
  bool _isLoading = true;
  List<dynamic> _problems = [];
  String? _error;
  final Set<String> _upvotedIds = {};

  final List<Map<String, String>> _categories = [
    {'key': '', 'label': 'All / सभी'},
    {'key': 'water', 'label': '💧 Water'},
    {'key': 'waste_management', 'label': '🗑️ Waste'},
    {'key': 'electricity', 'label': '⚡ Power'},
    {'key': 'agriculture', 'label': '🌾 Agri'},
    {'key': 'roads_transport', 'label': '🛣️ Roads'},
    {'key': 'healthcare', 'label': '🏥 Health'},
    {'key': 'education', 'label': '📚 Education'},
  ];

  @override
  void initState() {
    super.initState();
    _fetchProblems();
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _fetchProblems() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(problemsRepositoryProvider);
      final res = await repo.getAllProblems(
        category: _selectedCategory,
        search: _searchQuery.isEmpty ? null : _searchQuery,
      );
      if (!mounted) return;
      setState(() {
        _problems = (res['items'] as List<dynamic>?) ?? [];
        _isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
    }
  }

  Future<void> _handleUpvote(String problemId, int index) async {
    final isAlready = _upvotedIds.contains(problemId);
    setState(() {
      if (isAlready) {
        _upvotedIds.remove(problemId);
        _problems[index]['upvotes'] = ((_problems[index]['upvotes'] ?? 1) as int) - 1;
      } else {
        _upvotedIds.add(problemId);
        _problems[index]['upvotes'] = ((_problems[index]['upvotes'] ?? 0) as int) + 1;
      }
    });

    try {
      final repo = ref.read(problemsRepositoryProvider);
      await repo.upvoteProblem(problemId);
    } catch (_) {
      // Keep optimistic UI
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final syncState = ref.watch(offlineSyncProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9F7),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  'Samadhan Setu',
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.primaryDark,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'JHARKHAND',
                    style: GoogleFonts.inter(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.primary,
                      letterSpacing: 0.8,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              'Namaste, ${authState.name ?? "Nagrik"}',
              style: GoogleFonts.inter(
                fontSize: 12,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'My Submissions',
            icon: const Icon(Icons.history_edu_outlined, color: AppTheme.primary),
            onPressed: () => context.push('/citizen/submissions'),
          ),
          IconButton(
            tooltip: 'Logout',
            icon: const Icon(Icons.logout_rounded, color: Colors.grey, size: 20),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              context.go('/login');
            },
          ),
        ],
      ),
      body: Column(
        children: [
          // Offline banner
          OfflineBannerWidget(
            isOffline: !syncState.isOnline,
            pendingCount: syncState.pendingCount,
            onSyncTap: () => ref.read(offlineSyncProvider.notifier).flushQueue(),
          ),

          // Search bar
          Container(
            color: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search problems by area, keyword...',
                prefixIcon: const Icon(Icons.search, size: 20, color: Colors.grey),
                suffixIcon: _searchQuery.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          setState(() => _searchQuery = '');
                          _fetchProblems();
                        },
                      )
                    : null,
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
                fillColor: const Color(0xFFF4F6F4),
              ),
              onSubmitted: (val) {
                setState(() => _searchQuery = val.trim());
                _fetchProblems();
              },
            ),
          ),

          // Category Chips Bar
          Container(
            height: 48,
            color: Colors.white,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              itemCount: _categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final cat = _categories[index];
                final isSelected = (_selectedCategory ?? '') == cat['key'];
                return ChoiceChip(
                  label: Text(cat['label']!),
                  selected: isSelected,
                  selectedColor: AppTheme.primary.withOpacity(0.15),
                  backgroundColor: const Color(0xFFF1F4F1),
                  labelStyle: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                    color: isSelected ? AppTheme.primary : Colors.black87,
                  ),
                  side: BorderSide(
                    color: isSelected ? AppTheme.primary : Colors.transparent,
                  ),
                  onSelected: (selected) {
                    setState(() {
                      _selectedCategory = selected && cat['key']!.isNotEmpty
                          ? cat['key']
                          : null;
                    });
                    _fetchProblems();
                  },
                );
              },
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE8EFE8)),

          // Problem list
          Expanded(
            child: RefreshIndicator(
              onRefresh: _fetchProblems,
              color: AppTheme.primary,
              child: _isLoading
                  ? const LoadingWidget(message: 'Loading community problems...')
                  : _error != null
                      ? Center(
                          child: Padding(
                            padding: const EdgeInsets.all(24),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.cloud_off, size: 48, color: Colors.grey),
                                const SizedBox(height: 12),
                                Text(
                                  'Could not connect to server.\nCheck if backend is running.',
                                  textAlign: TextAlign.center,
                                  style: GoogleFonts.inter(color: Colors.grey[700]),
                                ),
                                const SizedBox(height: 16),
                                ElevatedButton(
                                  onPressed: _fetchProblems,
                                  child: const Text('Try Again'),
                                ),
                              ],
                            ),
                          ),
                        )
                      : _problems.isEmpty
                          ? EmptyStateWidget(
                              icon: Icons.assignment_turned_in_outlined,
                              title: 'No Problems Found',
                              description:
                                  'Be the first to report a civic challenge in your neighborhood!',
                              actionLabel: 'Report Problem',
                              onAction: () => context.push('/citizen/submit'),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _problems.length,
                              itemBuilder: (context, index) {
                                final p = _problems[index] as Map<String, dynamic>;
                                final id = p['id']?.toString() ?? '';
                                return ProblemCardWidget(
                                  problem: p,
                                  isUpvoted: _upvotedIds.contains(id),
                                  onTap: () => context.push('/citizen/problem/$id'),
                                  onUpvote: () => _handleUpvote(id, index),
                                );
                              },
                            ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/citizen/submit'),
        backgroundColor: AppTheme.secondary,
        icon: const Icon(Icons.add_circle_outline, color: Colors.white),
        label: Text(
          'Report Problem',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
      ),
    );
  }
}
