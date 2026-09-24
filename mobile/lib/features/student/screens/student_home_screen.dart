import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/widgets/empty_state_widget.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../../../shared/widgets/problem_card_widget.dart';
import '../../auth/providers/auth_provider.dart';
import '../../citizen/repositories/problems_repository.dart';
import '../repositories/teams_repository.dart';

class StudentHomeScreen extends ConsumerStatefulWidget {
  const StudentHomeScreen({super.key});

  @override
  ConsumerState<StudentHomeScreen> createState() => _StudentHomeScreenState();
}

class _StudentHomeScreenState extends ConsumerState<StudentHomeScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<dynamic> _myTeams = [];
  List<dynamic> _openProblems = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
        _myTeams = teams;
        _openProblems = (problemsRes['items'] as List<dynamic>?) ?? [];
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

  void _showKanbanModal(Map<String, dynamic> team) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => _KanbanBottomSheet(team: team),
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
                  'Student Innovation Hub',
                  style: GoogleFonts.inter(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF1565C0),
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1565C0).withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'INNOVATOR',
                    style: GoogleFonts.inter(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1565C0),
                    ),
                  ),
                ),
              ],
            ),
            Text(
              authState.name ?? 'Student Innovator',
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
        bottom: TabBar(
          controller: _tabController,
          labelColor: const Color(0xFF1565C0),
          unselectedLabelColor: Colors.grey[600],
          indicatorColor: const Color(0xFF1565C0),
          labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
          tabs: [
            Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.view_kanban_outlined, size: 16),
                  const SizedBox(width: 6),
                  Text('My Projects (${_myTeams.length})'),
                ],
              ),
            ),
            const Tab(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.explore_outlined, size: 16),
                  SizedBox(width: 6),
                  Text('Open Challenges'),
                ],
              ),
            ),
          ],
        ),
      ),
      body: _isLoading
          ? const LoadingWidget(message: 'Loading student workspace...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Error: $_error'),
                      const SizedBox(height: 12),
                      ElevatedButton(onPressed: _loadData, child: const Text('Retry')),
                    ],
                  ),
                )
              : TabBarView(
                  controller: _tabController,
                  children: [
                    // Tab 1: My Teams & Kanban
                    RefreshIndicator(
                      onRefresh: _loadData,
                      child: _myTeams.isEmpty
                          ? EmptyStateWidget(
                              icon: Icons.group_work_outlined,
                              title: 'No Active Innovation Teams',
                              description:
                                  'Explore open civic challenges from Jharkhand and form or join a multidisciplinary team under a faculty mentor!',
                              actionLabel: 'Browse Challenges',
                              onAction: () => _tabController.animateTo(1),
                            )
                          : ListView.builder(
                              padding: const EdgeInsets.all(16),
                              itemCount: _myTeams.length,
                              itemBuilder: (context, index) {
                                final team = _myTeams[index] as Map<String, dynamic>;
                                final problem = team['problem'] as Map<String, dynamic>?;
                                final mentor = team['facultyMentor'] as Map<String, dynamic>?;
                                final milestones = (team['milestones'] as List<dynamic>?) ?? [];
                                final completed = milestones.where((m) => m['status'] == 'done').length;

                                return Card(
                                  margin: const EdgeInsets.only(bottom: 16),
                                  elevation: 0,
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(16),
                                    side: const BorderSide(color: Color(0xFFE0EAE0)),
                                  ),
                                  child: Padding(
                                    padding: const EdgeInsets.all(18),
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 4,
                                              ),
                                              decoration: BoxDecoration(
                                                color: const Color(0xFF1565C0).withOpacity(0.1),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                'TEAM: ${team['name']}',
                                                style: GoogleFonts.inter(
                                                  fontSize: 12,
                                                  fontWeight: FontWeight.bold,
                                                  color: const Color(0xFF1565C0),
                                                ),
                                              ),
                                            ),
                                            const Spacer(),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 3,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.green.withOpacity(0.12),
                                                borderRadius: BorderRadius.circular(10),
                                              ),
                                              child: Text(
                                                (team['status'] as String? ?? 'active').toUpperCase(),
                                                style: GoogleFonts.inter(
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.green[800],
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 12),
                                        Text(
                                          problem?['title'] ?? 'Societal Project',
                                          style: GoogleFonts.inter(
                                            fontSize: 16,
                                            fontWeight: FontWeight.w700,
                                            color: Colors.black87,
                                          ),
                                        ),
                                        if (mentor != null) ...[
                                          const SizedBox(height: 6),
                                          Row(
                                            children: [
                                              const Icon(Icons.person_pin, size: 14, color: Colors.purple),
                                              const SizedBox(width: 4),
                                              Text(
                                                'Mentor: ${mentor['name'] ?? 'Faculty'}',
                                                style: GoogleFonts.inter(
                                                  fontSize: 12,
                                                  color: Colors.grey[700],
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                        const SizedBox(height: 14),

                                        // Milestone progress bar
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Text(
                                              'Milestones: $completed/${milestones.length} Completed',
                                              style: GoogleFonts.inter(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                                color: Colors.grey[700],
                                              ),
                                            ),
                                            Text(
                                              milestones.isNotEmpty
                                                  ? '${((completed / milestones.length) * 100).toInt()}%'
                                                  : '0%',
                                              style: GoogleFonts.inter(
                                                fontSize: 12,
                                                fontWeight: FontWeight.bold,
                                                color: const Color(0xFF1565C0),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 6),
                                        ClipRRect(
                                          borderRadius: BorderRadius.circular(4),
                                          child: LinearProgressIndicator(
                                            value: milestones.isNotEmpty ? completed / milestones.length : 0,
                                            backgroundColor: Colors.grey[200],
                                            color: const Color(0xFF1565C0),
                                            minHeight: 6,
                                          ),
                                        ),
                                        const SizedBox(height: 16),

                                        // Open Kanban Button
                                        SizedBox(
                                          width: double.infinity,
                                          child: OutlinedButton.icon(
                                            onPressed: () => _showKanbanModal(team),
                                            icon: const Icon(Icons.view_kanban, size: 18),
                                            label: const Text('Open Project Kanban'),
                                            style: OutlinedButton.styleFrom(
                                              foregroundColor: const Color(0xFF1565C0),
                                              side: const BorderSide(color: Color(0xFF1565C0)),
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                );
                              },
                            ),
                    ),

                    // Tab 2: Open Challenges
                    RefreshIndicator(
                      onRefresh: _loadData,
                      child: ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: _openProblems.length,
                        itemBuilder: (context, index) {
                          final p = _openProblems[index] as Map<String, dynamic>;
                          final id = p['id']?.toString() ?? '';
                          return ProblemCardWidget(
                            problem: p,
                            onTap: () => context.push('/citizen/problem/$id'),
                          );
                        },
                      ),
                    ),
                  ],
                ),
    );
  }
}

class _KanbanBottomSheet extends StatelessWidget {
  final Map<String, dynamic> team;
  const _KanbanBottomSheet({required this.team});

  @override
  Widget build(BuildContext context) {
    final milestones = (team['milestones'] as List<dynamic>?) ?? [];
    final todo = milestones.where((m) => m['status'] == 'todo').toList();
    final inProgress = milestones.where((m) => m['status'] == 'in_progress').toList();
    final done = milestones.where((m) => m['status'] == 'done').toList();

    return Container(
      height: MediaQuery.of(context).size.height * 0.75,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(Icons.view_kanban, color: Color(0xFF1565C0)),
              const SizedBox(width: 8),
              Text(
                '${team['name']} • Kanban Board',
                style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: ListView(
              children: [
                _buildKanbanColumn('📋 To Do (${todo.length})', todo, Colors.orange),
                const SizedBox(height: 14),
                _buildKanbanColumn('⚡ In Progress (${inProgress.length})', inProgress, Colors.blue),
                const SizedBox(height: 14),
                _buildKanbanColumn('✅ Done (${done.length})', done, Colors.green),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKanbanColumn(String title, List<dynamic> items, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAF8),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2EBE2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          const SizedBox(height: 8),
          if (items.isEmpty)
            Text(
              'No tasks in this lane',
              style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
            )
          else
            ...items.map(
              (m) => Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey[200]!),
                ),
                child: Row(
                  children: [
                    Icon(Icons.check_circle_outline, size: 16, color: color),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        m['title'] ?? '',
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
