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

class IndustryHomeScreen extends ConsumerStatefulWidget {
  const IndustryHomeScreen({super.key});

  @override
  ConsumerState<IndustryHomeScreen> createState() => _IndustryHomeScreenState();
}

class _IndustryHomeScreenState extends ConsumerState<IndustryHomeScreen> {
  List<dynamic> _prototypes = [];
  bool _isLoading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadPrototypes();
  }

  Future<void> _loadPrototypes() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final repo = ref.read(problemsRepositoryProvider);
      // Fetch problems in prototype or piloted stages
      final res = await repo.getAllProblems(limit: 20);
      if (!mounted) return;
      setState(() {
        _prototypes = (res['items'] as List<dynamic>?) ?? [];
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

  void _showOfferDialog(Map<String, dynamic> problem) {
    final amountCtrl = TextEditingController(text: '150000');
    final messageCtrl = TextEditingController(
      text: 'Interested in field-testing and deploying this MVP under our CSR environmental program.',
    );
    String offerType = 'csr_grant';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(
            'Fund or Adopt Prototype',
            style: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  problem['title'] ?? '',
                  style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.primary),
                ),
                const SizedBox(height: 16),
                Text('Support Type', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: offerType,
                  items: const [
                    DropdownMenuItem(value: 'csr_grant', child: Text('CSR Grant Funding')),
                    DropdownMenuItem(value: 'pilot_sponsor', child: Text('Field Pilot Sponsorship')),
                    DropdownMenuItem(value: 'commercial_adoption', child: Text('Commercial MVP Adoption / Licensing')),
                    DropdownMenuItem(value: 'mentorship_ip', child: Text('Industry Mentorship & Co-IP')),
                  ],
                  onChanged: (val) {
                    if (val != null) setDialogState(() => offerType = val);
                  },
                ),
                const SizedBox(height: 14),
                Text('Proposed Funding Amount (₹ INR)', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: amountCtrl,
                  keyboardType: TextInputType.number,
                  decoration: const InputDecoration(prefixText: '₹ '),
                ),
                const SizedBox(height: 14),
                Text('Note / Partnership Terms', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                TextField(
                  controller: messageCtrl,
                  maxLines: 3,
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
                final teams = (problem['projectTeams'] as List<dynamic>?) ?? [];
                if (teams.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Offer recorded! Will be notified when team is assigned.'),
                      backgroundColor: AppTheme.success,
                    ),
                  );
                  Navigator.pop(ctx);
                  return;
                }
                final teamId = teams.first['id'].toString();
                final auth = ref.read(authProvider);

                Navigator.pop(ctx);
                try {
                  await ref.read(teamsRepositoryProvider).submitIndustryOffer(
                        teamId: teamId,
                        partnerName: auth.name ?? 'Industry Partner',
                        offerAmount: double.tryParse(amountCtrl.text) ?? 100000,
                        offerType: offerType,
                        message: messageCtrl.text,
                      );
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Sponsorship offer transmitted to university team!'),
                      backgroundColor: AppTheme.success,
                    ),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Failed: $e'), backgroundColor: AppTheme.error),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.secondary),
              child: const Text('Submit Offer'),
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
                  'Industry & CSR Portal',
                  style: GoogleFonts.inter(
                    fontSize: 17,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.secondary,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: AppTheme.secondary.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    'CSR / INDUSTRY',
                    style: GoogleFonts.inter(
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.secondary,
                    ),
                  ),
                ),
              ],
            ),
            Text(
              authState.name ?? 'Corporate Partner',
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
          ? const LoadingWidget(message: 'Loading industry portal...')
          : _error != null
              ? Center(child: Text('Error: $_error'))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Banner
                      Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFFE65100), Color(0xFFFF6D00)],
                          ),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Catalyze Jharkhand Innovations',
                              style: GoogleFonts.inter(
                                fontSize: 17,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Support student prototypes with CSR funding, provide field pilot sites, and adopt scalable solutions with university incubation cells.',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.white.withOpacity(0.95),
                                height: 1.4,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text(
                        'Prototypes Seeking Industry Adoption',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                      const SizedBox(height: 12),

                      if (_prototypes.isEmpty)
                        const EmptyStateWidget(
                          icon: Icons.business_outlined,
                          title: 'No Prototypes Available',
                          description: 'Active university projects will appear here as prototypes are readied.',
                        )
                      else
                        ..._prototypes.map((p) {
                          final inst = p['assignedInstitution'] as Map<String, dynamic>?;

                          return Card(
                            margin: const EdgeInsets.only(bottom: 14),
                            child: Padding(
                              padding: const EdgeInsets.all(16),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                        decoration: BoxDecoration(
                                          color: AppTheme.secondary.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          (p['category'] as String? ?? 'PROJECT').toUpperCase(),
                                          style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.bold,
                                            color: AppTheme.secondary,
                                          ),
                                        ),
                                      ),
                                      const Spacer(),
                                      Text(
                                        p['district'] ?? 'Jharkhand',
                                        style: GoogleFonts.inter(fontSize: 12, color: Colors.grey[600]),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    p['title'] ?? '',
                                    style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.bold),
                                  ),
                                  const SizedBox(height: 6),
                                  Text(
                                    p['description'] ?? '',
                                    style: GoogleFonts.inter(fontSize: 12, color: Colors.grey[700]),
                                    maxLines: 2,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  if (inst != null) ...[
                                    const SizedBox(height: 10),
                                    Row(
                                      children: [
                                        const Icon(Icons.school, size: 14, color: AppTheme.primary),
                                        const SizedBox(width: 6),
                                        Text(
                                          inst['name'] ?? '',
                                          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                                        ),
                                      ],
                                    ),
                                  ],
                                  const SizedBox(height: 14),
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton.icon(
                                      onPressed: () => _showOfferDialog(p),
                                      icon: const Icon(Icons.handshake_outlined, size: 18),
                                      label: const Text('Adopt MVP / Submit CSR Offer'),
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: AppTheme.secondary,
                                      ),
                                    ),
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
