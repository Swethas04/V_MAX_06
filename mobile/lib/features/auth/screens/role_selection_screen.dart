import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../core/theme/app_theme.dart';
import '../providers/auth_provider.dart';
import '../repositories/auth_repository.dart';

class RoleSelectionScreen extends ConsumerStatefulWidget {
  const RoleSelectionScreen({super.key});

  @override
  ConsumerState<RoleSelectionScreen> createState() => _RoleSelectionScreenState();
}

class _RoleSelectionScreenState extends ConsumerState<RoleSelectionScreen> {
  String? _selectedRole;
  bool _isLoading = false;

  final List<Map<String, dynamic>> _roles = [
    {
      'role': 'citizen',
      'title': 'Citizen / Nagrik',
      'subtitle': 'नागरिक',
      'desc': 'Report civic issues, water, waste, electricity and track ground resolution.',
      'icon': Icons.person_pin_circle_outlined,
      'color': AppTheme.primary,
      'target': '/citizen',
    },
    {
      'role': 'student',
      'title': 'Student Innovator',
      'subtitle': 'छात्र अन्वेषक',
      'desc': 'Solve real-world challenges, build prototypes, gain academic credits & funding.',
      'icon': Icons.school_outlined,
      'color': const Color(0xFF1976D2),
      'target': '/student',
    },
    {
      'role': 'faculty',
      'title': 'Faculty Mentor',
      'subtitle': 'संकाय मार्गदर्शक',
      'desc': 'Mentor multidisciplinary student teams, validate research & R&D grants.',
      'icon': Icons.psychology_outlined,
      'color': const Color(0xFF7B1FA2),
      'target': '/faculty',
    },
    {
      'role': 'industry_partner',
      'title': 'Industry / CSR Partner',
      'subtitle': 'उद्योग साझेदार',
      'desc': 'Fund impactful prototypes, license student MVPs & meet top engineering talent.',
      'icon': Icons.apartment_outlined,
      'color': AppTheme.secondary,
      'target': '/industry',
    },
  ];

  Future<void> _handleConfirm() async {
    if (_selectedRole == null) return;
    setState(() => _isLoading = true);
    try {
      final repo = ref.read(authRepositoryProvider);
      await repo.selectRole(_selectedRole!);
      ref.read(authProvider.notifier).setRole(_selectedRole!);

      if (!mounted) return;
      setState(() => _isLoading = false);

      final target = _roles.firstWhere((r) => r['role'] == _selectedRole)['target'] as String;
      context.go(target);
    } catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to update role: $e'),
          backgroundColor: AppTheme.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF9FAF9),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Select Your Role',
                style: GoogleFonts.inter(
                  fontSize: 24,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Choose how you want to participate in Jharkhand\'s societal innovation network.',
                style: GoogleFonts.inter(fontSize: 14, color: Colors.grey[600]),
              ),
              const SizedBox(height: 24),

              // Role cards
              ..._roles.map((r) {
                final isSelected = _selectedRole == r['role'];
                final color = r['color'] as Color;

                return GestureDetector(
                  onTap: () => setState(() => _selectedRole = r['role'] as String),
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(
                        color: isSelected ? color : const Color(0xFFE2EBE2),
                        width: isSelected ? 2 : 1,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: color.withOpacity(0.12),
                                blurRadius: 12,
                                offset: const Offset(0, 4),
                              ),
                            ]
                          : [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.02),
                                blurRadius: 4,
                                offset: const Offset(0, 2),
                              ),
                            ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(r['icon'] as IconData, color: color, size: 26),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    r['title'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 15,
                                      fontWeight: FontWeight.w700,
                                      color: Colors.black87,
                                    ),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    '(${r['subtitle']})',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                r['desc'] as String,
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: Colors.grey[600],
                                  height: 1.35,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 10),
                        Radio<String>(
                          value: r['role'] as String,
                          groupValue: _selectedRole,
                          activeColor: color,
                          onChanged: (val) => setState(() => _selectedRole = val),
                        ),
                      ],
                    ),
                  ),
                );
              }),

              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                height: 52,
                child: ElevatedButton(
                  onPressed: _selectedRole == null || _isLoading ? null : _handleConfirm,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primary,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : Text(
                          'Continue as ${_selectedRole == null ? '' : _roles.firstWhere((r) => r['role'] == _selectedRole)['title'].toString().split(' ')[0]}  →',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
