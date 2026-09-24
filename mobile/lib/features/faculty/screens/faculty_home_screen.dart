import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../auth/providers/auth_provider.dart';
import '../../citizen/repositories/problems_repository.dart';
import '../../student/repositories/teams_repository.dart';

class FacultyHomeScreen extends ConsumerStatefulWidget {
  const FacultyHomeScreen({super.key});

  @override
  ConsumerState<FacultyHomeScreen> createState() => _FacultyHomeScreenState();
}

class _FacultyHomeScreenState extends ConsumerState<FacultyHomeScreen> {
  List<dynamic> _teams = [];
  List<dynamic> _assignedProblems = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final teamsRepo = ref.read(teamsRepositoryProvider);
      final probRepo = ref.read(problemsRepositoryProvider);

      final teams = await teamsRepo.getMyTeams();
      final problemsRes = await probRepo.getAllProblems(limit: 20);

      if (!mounted) return;
      setState(() {
        _teams = teams;
        _assignedProblems = (problemsRes['items'] as List<dynamic>?) ?? [];
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

  void _showCreateTeamDialog() {
    final nameCtrl = TextEditingController();
    String? selectedProblemId =
        _assignedProblems.isNotEmpty ? _assignedProblems.first['id']?.toString() : null;

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(
            'Form Innovation Team',
            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Team Name', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: nameCtrl,
                  decoration: const InputDecoration(hintText: 'e.g. Team Jal-Rakshak'),
                ),
                const SizedBox(height: 16),
                Text('Assign to Problem', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: selectedProblemId,
                  isExpanded: true,
                  items: _assignedProblems.map((p) {
                    return DropdownMenuItem<String>(
                      value: p['id'].toString(),
                      child: Text(
                        p['title'] ?? '',
                        style: GoogleFonts.inter(fontSize: 12),
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (val) => setDialogState(() => selectedProblemId = val),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (nameCtrl.text.trim().isEmpty || selectedProblemId == null) return;
                Navigator.pop(ctx);
                try {
                  final auth = ref.read(authProvider);
                  await ref.read(teamsRepositoryProvider).createTeam(
                        name: nameCtrl.text.trim(),
                        problemId: selectedProblemId!,
                        facultyMentorId: auth.userId ?? '',
                      );
                  _loadData();
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Team successfully formed!'),
                      backgroundColor: AppTheme.success,
                    ),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Failed to create team: $e'),
                      backgroundColor: AppTheme.error,
                    ),
                  );
                }
              },
              child: const Text('Create Team'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

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
                  'Faculty Mentorship Hub',
                  style: GoogleFonts.inter(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF7B1FA2),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF7B1FA2).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'FACULTY MENTOR',
                    style: GoogleFonts.inter(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF7B1FA2),
                    ),
                  ),
                ),
              ],
            ),
            Text(
              'Dr. ${authState.name ?? "Mentor"}',
              style: GoogleFonts.inter(fontSize: 12, color: Colors.grey[600]),
            ),
          ],
        ),
        actions: [
          IconButton(
            tooltip: 'Switch Role',
            icon: const Icon(Icons.swap_horiz_rounded, color: Colors.grey),
            onPressed: () => context.go('/role-select'),
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
      body: _isLoading
          ? const LoadingWidget(message: 'Loading faculty workspace...')
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Overview Banner
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF6A1B9A), Color(0xFF8E24AA)],
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Institutional R&D Leadership',
                                    style: GoogleFonts.inter(
                                      fontSize: 16,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    'Guide multidisciplinary student batches to turn local Jharkhand problems into patentable MVPs.',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: Colors.white.withOpacity(0.9),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 12),
                            ElevatedButton(
                              onPressed: _showCreateTeamDialog,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF6A1B9A),
                              ),
                              child: const Text('+ Form Team'),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text(
                        'Active Mentored Teams (${_teams.length})',
                        style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 12),
                      if (_teams.isEmpty)
                        EmptyStateWidget(
                          icon: Icons.psychology_outlined,
                          title: 'No Mentored Teams Yet',
                          description:
                              'Form a student innovation team for problems assigned to your institution by the AI routing engine.',
                          actionLabel: 'Form Team Now',
                          onAction: _showCreateTeamDialog,
                        )
                      else
                        ..._teams.map((t) {
                          final p = t['problem'] as Map<String, dynamic>?;
                          final milestones = (t['milestones'] as List<dynamic>?) ?? [];
                          final completed = milestones.where((m) => m['status'] == 'done').length;

                          return Card(
                            margin: const EdgeInsets.only(bottom: 14),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Text(
                                        t['name'] ?? '',
                                        style: GoogleFonts.inter(
                                          fontSize: 16,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const Spacer(),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFF7B1FA2).withOpacity(0.1),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          '${milestones.length} Milestones',
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: const Color(0xFF7B1FA2),
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    p?['title'] ?? 'Challenge',
                                    style: GoogleFonts.inter(fontSize: 13, color: Colors.grey[800]),
                                  ),
                                  const SizedBox(height: 12),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: ClipRRect(
                                          borderRadius: BorderRadius.circular(4),
                                          child: LinearProgressIndicator(
                                            value: milestones.isNotEmpty
                                                ? completed / milestones.length
                                                : 0,
                                            color: const Color(0xFF7B1FA2),
                                            backgroundColor: Colors.grey[200],
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 10),
                                      Text('$completed/${milestones.length} done'),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          );
                        }),
                    ],
                  ),
                ),
    );
  }
}
