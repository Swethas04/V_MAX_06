import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/loading_widget.dart';
import '../repositories/problems_repository.dart';

class ProblemStatusScreen extends ConsumerStatefulWidget {
  final String problemId;
  const ProblemStatusScreen({super.key, required this.problemId});

  @override
  ConsumerState<ProblemStatusScreen> createState() => _ProblemStatusScreenState();
}

class _ProblemStatusScreenState extends ConsumerState<ProblemStatusScreen> {
  Map<String, dynamic>? _problem;
  bool _isLoading = true;
  String? _error;

  final List<Map<String, dynamic>> _stages = [
    {
      'key': 'submitted',
      'title': 'Problem Submitted',
      'hi': 'समस्या दर्ज की गई',
      'desc': 'Received by Samadhan Setu civic portal',
      'icon': Icons.description_outlined,
    },
    {
      'key': 'under_review',
      'title': 'AI Classification & Matching',
      'hi': 'AI द्वारा विश्लेषण',
      'desc': 'Categorized, prioritized, and matched with university research strengths',
      'icon': Icons.auto_awesome,
    },
    {
      'key': 'assigned',
      'title': 'Assigned to University',
      'hi': 'संस्थान को सौंपा गया',
      'desc': 'Routed to premier technical institution in Jharkhand',
      'icon': Icons.account_balance_outlined,
    },
    {
      'key': 'team_formed',
      'title': 'Student-Faculty Team Formed',
      'hi': 'अन्वेषक टीम गठित',
      'desc': 'Multidisciplinary team assigned for R&D innovation',
      'icon': Icons.groups_outlined,
    },
    {
      'key': 'prototype',
      'title': 'Working Prototype Ready',
      'hi': 'प्रोटोटाइप तैयार',
      'desc': 'Hardware/software MVP developed and lab-validated',
      'icon': Icons.build_circle_outlined,
    },
    {
      'key': 'piloted',
      'title': 'Field Pilot in Jharkhand',
      'hi': 'जमीनी परीक्षण',
      'desc': 'Deployment in the affected village/district for validation',
      'icon': Icons.verified_user_outlined,
    },
    {
      'key': 'resolved',
      'title': 'Resolved & Impactful',
      'hi': 'समाधान पूर्ण',
      'desc': 'Permanent societal solution delivered to the community',
      'icon': Icons.task_alt,
    },
  ];

  @override
  void initState() {
    super.initState();
    _fetchDetails();
  }

  Future<void> _fetchDetails() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(problemsRepositoryProvider);
      final data = await repo.getProblemById(widget.problemId);
      if (!mounted) return;
      setState(() {
        _problem = data;
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

  int _getStageIndex(String? status) {
    switch (status) {
      case 'submitted':
        return 0;
      case 'under_review':
        return 1;
      case 'assigned':
        return 2;
      case 'team_formed':
        return 3;
      case 'prototype':
        return 4;
      case 'piloted':
        return 5;
      case 'resolved':
        return 6;
      default:
        return 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F9F7),
      appBar: AppBar(
        title: Text(
          'Problem Lifecycle Tracking',
          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: _isLoading
          ? const LoadingWidget(message: 'Loading problem details...')
          : _error != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text('Error: $_error'),
                      const SizedBox(height: 12),
                      ElevatedButton(
                        onPressed: _fetchDetails,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : _problem == null
                  ? const Center(child: Text('Problem not found'))
                  : SingleChildScrollView(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Header Card
                          Container(
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE2EBE2)),
                            ),
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
                                        color: AppTheme.primary.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        (_problem!['category'] as String? ?? 'OTHER')
                                            .toUpperCase()
                                            .replaceAll('_', ' '),
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                          color: AppTheme.primary,
                                        ),
                                      ),
                                    ),
                                    const Spacer(),
                                    Icon(
                                      Icons.location_on_outlined,
                                      size: 15,
                                      color: Colors.grey[600],
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      _problem!['district'] as String? ?? 'Jharkhand',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: Colors.grey[700],
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Text(
                                  _problem!['title'] as String? ?? '',
                                  style: GoogleFonts.inter(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  _problem!['description'] as String? ?? '',
                                  style: GoogleFonts.inter(
                                    fontSize: 13,
                                    color: Colors.grey[700],
                                    height: 1.45,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 24),

                          // 7-Stage Pipeline Stepper
                          Text(
                            'Lifecycle Progress (7 Stages)',
                            style: GoogleFonts.inter(
                              fontSize: 15,
                              fontWeight: FontWeight.bold,
                              color: Colors.black87,
                            ),
                          ),
                          const SizedBox(height: 12),

                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFE2EBE2)),
                            ),
                            child: Column(
                              children: List.generate(_stages.length, (index) {
                                final stage = _stages[index];
                                final currentStageIdx =
                                    _getStageIndex(_problem!['status'] as String?);
                                final isPassed = index < currentStageIdx;
                                final isCurrent = index == currentStageIdx;
                                final isPending = index > currentStageIdx;

                                final color = isPassed
                                    ? AppTheme.success
                                    : isCurrent
                                        ? AppTheme.primary
                                        : Colors.grey[300]!;

                                return Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Column(
                                      children: [
                                        Container(
                                          width: 32,
                                          height: 32,
                                          decoration: BoxDecoration(
                                            color: isPassed
                                                ? AppTheme.success
                                                : isCurrent
                                                    ? AppTheme.primary
                                                    : Colors.grey[100],
                                            shape: BoxShape.circle,
                                            border: Border.all(
                                              color: color,
                                              width: isCurrent ? 2 : 1,
                                            ),
                                          ),
                                          child: Icon(
                                            isPassed
                                                ? Icons.check
                                                : stage['icon'] as IconData,
                                            size: 16,
                                            color: isPending ? Colors.grey : Colors.white,
                                          ),
                                        ),
                                        if (index < _stages.length - 1)
                                          Container(
                                            width: 2,
                                            height: 38,
                                            color: isPassed
                                                ? AppTheme.success
                                                : Colors.grey[200],
                                          ),
                                      ],
                                    ),
                                    const SizedBox(width: 14),
                                    Expanded(
                                      child: Padding(
                                        padding: const EdgeInsets.only(bottom: 20),
                                        child: Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Row(
                                              children: [
                                                Text(
                                                  stage['title'] as String,
                                                  style: GoogleFonts.inter(
                                                    fontSize: 14,
                                                    fontWeight: isCurrent
                                                        ? FontWeight.bold
                                                        : FontWeight.w600,
                                                    color: isPending
                                                        ? Colors.grey[500]
                                                        : Colors.black87,
                                                  ),
                                                ),
                                                if (isCurrent) ...[
                                                  const SizedBox(width: 8),
                                                  Container(
                                                    padding: const EdgeInsets.symmetric(
                                                      horizontal: 6,
                                                      vertical: 2,
                                                    ),
                                                    decoration: BoxDecoration(
                                                      color: AppTheme.primary.withOpacity(0.12),
                                                      borderRadius: BorderRadius.circular(4),
                                                    ),
                                                    child: Text(
                                                      'CURRENT',
                                                      style: GoogleFonts.inter(
                                                        fontSize: 9,
                                                        fontWeight: FontWeight.w800,
                                                        color: AppTheme.primary,
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ],
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              '(${stage['hi']})',
                                              style: GoogleFonts.inter(
                                                fontSize: 11,
                                                color: Colors.grey[500],
                                              ),
                                            ),
                                            const SizedBox(height: 2),
                                            Text(
                                              stage['desc'] as String,
                                              style: GoogleFonts.inter(
                                                fontSize: 11,
                                                color: Colors.grey[600],
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                );
                              }),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // AI Routing & University Card (if assigned)
                          if (_problem!['assignedInstitution'] != null) ...[
                            Text(
                              'Assigned Academic Institution',
                              style: GoogleFonts.inter(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: Colors.black87,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFD4E5D4)),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    width: 48,
                                    height: 48,
                                    decoration: BoxDecoration(
                                      color: AppTheme.primary.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: const Icon(
                                      Icons.school,
                                      color: AppTheme.primary,
                                      size: 26,
                                    ),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          _problem!['assignedInstitution']['name'] ?? '',
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            fontWeight: FontWeight.bold,
                                            color: Colors.black87,
                                          ),
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          'District: ${_problem!['assignedInstitution']['district'] ?? 'Jharkhand'}',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            color: Colors.grey[600],
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 24),
                          ],
                        ],
                      ),
                    ),
    );
  }
}
