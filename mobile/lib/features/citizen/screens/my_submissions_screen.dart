import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../shared/widgets/problem_card_widget.dart';
import '../repositories/problems_repository.dart';

class MySubmissionsScreen extends ConsumerStatefulWidget {
  const MySubmissionsScreen({super.key});

  @override
  ConsumerState<MySubmissionsScreen> createState() => _MySubmissionsScreenState();
}

class _MySubmissionsScreenState extends ConsumerState<MySubmissionsScreen> {
  List<dynamic> _submissions = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _fetchMySubmissions();
  }

  Future<void> _fetchMySubmissions() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(problemsRepositoryProvider);
      final list = await repo.getMySubmissions();
      if (!mounted) return;
      setState(() {
        _submissions = list;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9F7),
      appBar: AppBar(
        title: Text(
          'My Submissions',
          style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: RefreshIndicator(
        onRefresh: _fetchMySubmissions,
        color: AppTheme.primary,
        child: _isLoading
            ? const LoadingWidget(message: 'Loading your reports...')
            : _error != null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Failed to load: $_error'),
                        const SizedBox(height: 12),
                        ElevatedButton(
                          onPressed: _fetchMySubmissions,
                          child: const Text('Try Again'),
                        ),
                      ],
                    ),
                  )
                : _submissions.isEmpty
                    ? EmptyStateWidget(
                        icon: Icons.history_edu_outlined,
                        title: 'No Reports Yet',
                        description:
                            'You have not submitted any societal challenges yet. Report an issue to connect it to Jharkhand colleges!',
                        actionLabel: 'Report Now',
                        onAction: () => context.push('/citizen/submit'),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _submissions.length,
                        itemBuilder: (context, index) {
                          final item = _submissions[index] as Map<String, dynamic>;
                          final id = item['id']?.toString() ?? '';
                          return ProblemCardWidget(
                            problem: item,
                            onTap: () => context.push('/citizen/problem/$id'),
                          );
                        },
                      ),
      ),
    );
  }
}
