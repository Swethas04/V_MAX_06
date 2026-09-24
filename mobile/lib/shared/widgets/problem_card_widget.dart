import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class ProblemCardWidget extends StatelessWidget {
  final Map<String, dynamic> problem;
  final VoidCallback? onTap;
  final VoidCallback? onUpvote;
  final bool isUpvoted;

  const ProblemCardWidget({
    super.key,
    required this.problem,
    this.onTap,
    this.onUpvote,
    this.isUpvoted = false,
  });

  String _formatStatus(String? status) {
    switch (status) {
      case 'submitted':
        return 'Submitted';
      case 'under_review':
        return 'AI Classified';
      case 'assigned':
        return 'Assigned to College';
      case 'team_formed':
        return 'Team Formed';
      case 'prototype':
        return 'Prototype Ready';
      case 'piloted':
        return 'Pilot Testing';
      case 'resolved':
        return 'Resolved';
      default:
        return (status ?? 'submitted').toUpperCase();
    }
  }

  Color _categoryColor(String? cat) {
    switch (cat?.toLowerCase()) {
      case 'water':
        return const Color(0xFF0288D1);
      case 'waste_management':
        return const Color(0xFF5D4037);
      case 'electricity':
        return const Color(0xFFF57C00);
      case 'agriculture':
        return const Color(0xFF388E3C);
      case 'roads_transport':
        return const Color(0xFF455A64);
      case 'healthcare':
        return const Color(0xFFD32F2F);
      case 'education':
        return const Color(0xFF7B1FA2);
      default:
        return AppTheme.primary;
    }
  }

  @override
  Widget build(BuildContext context) {
    final status = problem['status'] as String? ?? 'submitted';
    final statusColor = AppTheme.statusColor(status);
    final category = (problem['category'] as String? ?? 'other').replaceAll('_', ' ');
    final district = problem['district'] as String? ?? 'Jharkhand';
    final upvotes = problem['upvotes'] as int? ?? 0;
    final priority = problem['priority'] as String?;
    final assignedInst = problem['assignedInstitution'] as Map<String, dynamic>?;
    final aiResult = problem['aiRoutingResult'] as Map<String, dynamic>?;
    final explained = (aiResult?['suggestedInstitutionsExplained'] as List<dynamic>?) ?? [];
    List<dynamic> matchedTags = (problem['matchedOn'] as List<dynamic>?) ?? [];
    if (matchedTags.isEmpty && explained.isNotEmpty) {
      final firstMatch = explained.first as Map<String, dynamic>?;
      matchedTags = (firstMatch?['matchedOn'] as List<dynamic>?) ?? [];
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 14),
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE8EFE8)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Row: Category + Status Badge
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                    decoration: BoxDecoration(
                      color: _categoryColor(problem['category'] as String?).withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      category.toUpperCase(),
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: _categoryColor(problem['category'] as String?),
                        letterSpacing: 0.5,
                      ),
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: statusColor.withOpacity(0.3)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 6,
                          height: 6,
                          decoration: BoxDecoration(
                            color: statusColor,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _formatStatus(status),
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: statusColor,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),

              // Title
              Text(
                problem['title'] as String? ?? 'Untitled Challenge',
                style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.black87,
                  height: 1.3,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 6),

              // Description preview
              Text(
                problem['description'] as String? ?? '',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  color: Colors.grey[700],
                  height: 1.4,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 12),

              // Assigned institution info if available
              if (assignedInst != null) ...[
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0F7F0),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.school, size: 14, color: AppTheme.primary),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          'Assigned to: ${assignedInst['name'] ?? ''}',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.primaryDark,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
              ],

              // Explainable AI Routing: Matched On Tags
              if (matchedTags.isNotEmpty) ...[
                Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Wrap(
                    spacing: 6,
                    runSpacing: 4,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      Text(
                        'Matched on:',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[700],
                        ),
                      ),
                      ...matchedTags.map(
                        (tag) => Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2.5),
                          decoration: BoxDecoration(
                            color: const Color(0xFFE8F5E9),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFC8E6C9)),
                          ),
                          child: Text(
                            tag.toString(),
                            style: GoogleFonts.inter(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: const Color(0xFF2E7D32),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],

              // Footer: Location, Priority, Upvote
              Row(
                children: [
                  Icon(Icons.location_on_outlined, size: 14, color: Colors.grey[600]),
                  const SizedBox(width: 3),
                  Text(
                    district,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.grey[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  if (priority != null) ...[
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: priority == 'critical'
                            ? Colors.red.withOpacity(0.1)
                            : Colors.orange.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        priority.toUpperCase(),
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: priority == 'critical' ? Colors.red : Colors.orange[800],
                        ),
                      ),
                    ),
                  ],
                  const Spacer(),
                  // Upvote button
                  InkWell(
                    onTap: onUpvote,
                    borderRadius: BorderRadius.circular(20),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: isUpvoted
                            ? AppTheme.primary.withOpacity(0.1)
                            : Colors.grey.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isUpvoted ? AppTheme.primary : Colors.transparent,
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            isUpvoted ? Icons.thumb_up : Icons.thumb_up_alt_outlined,
                            size: 14,
                            color: isUpvoted ? AppTheme.primary : Colors.grey[700],
                          ),
                          const SizedBox(width: 5),
                          Text(
                            '$upvotes',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: isUpvoted ? AppTheme.primary : Colors.grey[800],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
