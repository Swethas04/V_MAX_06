import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/data/mock_data.dart';

class LeaderboardScreen extends StatelessWidget {
  const LeaderboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      body: CustomScrollView(
        slivers: [
          // Hero header
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF0F4826), Color(0xFF1A6B3C)],
                ),
              ),
              padding: const EdgeInsets.fromLTRB(20, 56, 20, 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.emoji_events, size: 12, color: Color(0xFFFFB703)),
                        const SizedBox(width: 4),
                        Text(
                          'JHARKHAND STATE INNOVATION INDEX',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                            letterSpacing: 0.4,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Academic Institution Innovation Rankings',
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Benchmarked by active prototypes, community resolutions & industry CSR grants.',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: const Color(0xFFC4E0CB),
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Podium (top 3)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  // Silver (#2)
                  Expanded(child: _PodiumCard(entry: mockLeaderboard[1] as Map<String, dynamic>, height: 100)),
                  const SizedBox(width: 8),
                  // Gold (#1)
                  Expanded(child: _PodiumCard(entry: mockLeaderboard[0] as Map<String, dynamic>, height: 130)),
                  const SizedBox(width: 8),
                  // Bronze (#3)
                  Expanded(child: _PodiumCard(entry: mockLeaderboard[2] as Map<String, dynamic>, height: 85)),
                ],
              ),
            ),
          ),

          // All entries list
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final u = mockLeaderboard[index] as Map<String, dynamic>;
                  return _RankCard(u: u);
                },
                childCount: mockLeaderboard.length,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _PodiumCard extends StatelessWidget {
  final Map<String, dynamic> entry;
  final double height;
  const _PodiumCard({required this.entry, required this.height});

  @override
  Widget build(BuildContext context) {
    final rank = entry['rank'] as int;
    final rankColor = rank == 1
        ? const Color(0xFFFFB703)
        : rank == 2
            ? const Color(0xFF90A4AE)
            : const Color(0xFFCD7F32);

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: rankColor.withOpacity(0.4),
          width: rank == 1 ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: rankColor.withOpacity(0.15),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: rankColor,
            radius: 16,
            child: Text(
              '#$rank',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: Colors.white,
              ),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            entry['code'] as String,
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF1A6B3C),
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 2),
          Text(
            '${entry['resolved']} Resolved',
            style: GoogleFonts.inter(
              fontSize: 9,
              fontWeight: FontWeight.w700,
              color: Colors.grey[600],
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _RankCard extends StatelessWidget {
  final Map<String, dynamic> u;
  const _RankCard({required this.u});

  @override
  Widget build(BuildContext context) {
    final rank = u['rank'] as int;
    final isGold = rank == 1;
    final isSilver = rank == 2;
    final isBronze = rank == 3;
    final medalColor = isGold
        ? const Color(0xFFFFB703)
        : isSilver
            ? const Color(0xFF90A4AE)
            : isBronze
                ? const Color(0xFFCD7F32)
                : null;
    final domains = (u['topDomains'] as List).cast<String>();

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isGold ? const Color(0xFFFFFDE7) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isGold
              ? const Color(0xFFFFB703).withOpacity(0.3)
              : const Color(0xFFE2EDE4),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                // Rank badge
                if (medalColor != null)
                  Icon(Icons.workspace_premium, color: medalColor, size: 22)
                else
                  Container(
                    width: 28,
                    height: 28,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF4F7F4),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      '#$rank',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                const SizedBox(width: 10),
                // Institution name & abbrev
                Container(
                  width: 40,
                  height: 40,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A6B3C).withOpacity(0.08),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    u['code'] as String,
                    style: GoogleFonts.inter(
                      fontSize: 8,
                      fontWeight: FontWeight.w800,
                      color: const Color(0xFF1A6B3C),
                    ),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        u['name'] as String,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF1A2420),
                        ),
                      ),
                      Text(
                        '${u['district']}, Jharkhand',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: Colors.grey[500],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            const Divider(color: Color(0xFFEDF2ED), height: 1),
            const SizedBox(height: 12),
            Row(
              children: [
                _StatChip(label: '${u['activeTeams']} Teams', color: const Color(0xFF1565C0)),
                const SizedBox(width: 8),
                _StatChip(label: '${u['prototypes']} MVPs', color: const Color(0xFF7B1FA2)),
                const SizedBox(width: 8),
                _StatChip(label: '${u['resolved']} Resolved', color: const Color(0xFF2E7D32)),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                Icon(Icons.currency_rupee, size: 13, color: Colors.grey[500]),
                Expanded(
                  child: Text(
                    '${u['industryGrants']}  CSR grants mobilized',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFFC2410C),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              children: domains
                  .map(
                    (d) => Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFEDF2ED),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: Text(
                        d,
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1A2420),
                        ),
                      ),
                    ),
                  )
                  .toList(),
            ),
          ],
        ),
      ),
    );
  }
}

class _StatChip extends StatelessWidget {
  final String label;
  final Color color;
  const _StatChip({required this.label, required this.color});

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w700,
            color: color,
          ),
        ),
      );
}
