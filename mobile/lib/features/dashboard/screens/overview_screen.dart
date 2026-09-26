import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/data/mock_data.dart';

class OverviewScreen extends StatelessWidget {
  const OverviewScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final kpis = [
      {
        'label': 'Citizen Challenges',
        'value': '${mockSummary['totalProblems']}',
        'sub': '${mockSummary['aiRoutingRate']}% AI Routed',
        'icon': Icons.description_outlined,
        'color': const Color(0xFF1A6B3C),
        'bg': const Color(0x141A6B3C),
      },
      {
        'label': 'Assigned to Universities',
        'value': '${mockSummary['assignedToColleges']}',
        'sub': '3 Tier-1 Engineering Institutes',
        'icon': Icons.account_balance_outlined,
        'color': const Color(0xFF1565C0),
        'bg': const Color(0x141565C0),
      },
      {
        'label': 'Working Prototypes',
        'value': '${mockSummary['activePrototypes']}',
        'sub': 'Lab & Field Tested',
        'icon': Icons.memory_outlined,
        'color': const Color(0xFF7B1FA2),
        'bg': const Color(0x147B1FA2),
      },
      {
        'label': 'Field Pilot Tests',
        'value': '${mockSummary['fieldPilots']}',
        'sub': 'In Jharkhand Villages',
        'icon': Icons.trending_up,
        'color': const Color(0xFFE65100),
        'bg': const Color(0x14E65100),
      },
      {
        'label': 'Community Resolutions',
        'value': '${mockSummary['resolvedCount']}',
        'sub': 'Permanent Solutions Delivered',
        'icon': Icons.check_circle_outline,
        'color': const Color(0xFF2E7D32),
        'bg': const Color(0x142E7D32),
      },
      {
        'label': 'Industry CSR Mobilized',
        'value': '${mockSummary['industryFundingCommitted']}',
        'sub': 'Tata Steel, SAIL, Coal India',
        'icon': Icons.monetization_on_outlined,
        'color': const Color(0xFFC2410C),
        'bg': const Color(0x14C2410C),
      },
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 140,
            floating: false,
            pinned: true,
            backgroundColor: const Color(0xFF1A6B3C),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF1A6B3C), Color(0xFF0F4826)],
                  ),
                ),
                padding: const EdgeInsets.fromLTRB(20, 50, 20, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'SIH 2024  •  PS 26043',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                          letterSpacing: 0.4,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'SANKALP Dashboard',
                      style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                // KPI Grid
                GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: kpis.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.5,
                  ),
                  itemBuilder: (context, i) {
                    final kpi = kpis[i];
                    return Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  kpi['label'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: Colors.grey[600],
                                  ),
                                  maxLines: 2,
                                ),
                              ),
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  color: kpi['bg'] as Color,
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Icon(
                                  kpi['icon'] as IconData,
                                  size: 16,
                                  color: kpi['color'] as Color,
                                ),
                              ),
                            ],
                          ),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                kpi['value'] as String,
                                style: GoogleFonts.inter(
                                  fontSize: 20,
                                  fontWeight: FontWeight.w800,
                                  color: const Color(0xFF1A2420),
                                ),
                              ),
                              Text(
                                kpi['sub'] as String,
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                  color: kpi['color'] as Color,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),

                const SizedBox(height: 20),

                // Hero Banner
                Container(
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF1A6B3C), Color(0xFF0F4826)],
                    ),
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF1A6B3C).withOpacity(0.3),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(22),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Transforming Civic Challenges Into Academic Patents & Industry Solutions',
                        style: GoogleFonts.inter(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: Colors.white,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'SANKALP ingests hyper-local civic submissions across Jharkhand, leverages AI semantic deduplication and institutional capability matching.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: const Color(0xFFC4E0CB),
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          _BannerButton(
                            label: 'GIS Heatmap',
                            icon: Icons.map_outlined,
                            onTap: () {},
                            filled: true,
                          ),
                          const SizedBox(width: 10),
                          _BannerButton(
                            label: 'University Rankings',
                            icon: Icons.emoji_events_outlined,
                            onTap: () {},
                            filled: false,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Top Problem Domains
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Top Problem Domains in Jharkhand',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF1A2420),
                        ),
                      ),
                      const SizedBox(height: 16),
                      ...mockCategories.map((c) {
                        final pct = (c['count'] as int) / 46.0;
                        final col = Color(c['colorVal'] as int);
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    c['category'] as String,
                                    style: GoogleFonts.inter(
                                      fontSize: 12.5,
                                      fontWeight: FontWeight.w600,
                                      color: const Color(0xFF1A2420),
                                    ),
                                  ),
                                  Text(
                                    '${c['count']} challenges',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w700,
                                      color: col,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 5),
                              ClipRRect(
                                borderRadius: BorderRadius.circular(3),
                                child: LinearProgressIndicator(
                                  value: pct,
                                  backgroundColor: const Color(0xFFEDF2ED),
                                  valueColor: AlwaysStoppedAnimation(col),
                                  minHeight: 6,
                                ),
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Top Universities Preview
                Container(
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Top Academic Innovators',
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: const Color(0xFF1A2420),
                        ),
                      ),
                      Text(
                        'Based on prototypes, resolutions & CSR grants',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: Colors.grey[500],
                        ),
                      ),
                      const SizedBox(height: 14),
                      ...mockLeaderboard.take(3).map((u) {
                        final rank = u['rank'] as int;
                        final rankColor = rank == 1
                            ? const Color(0xFFFFB703)
                            : rank == 2
                                ? const Color(0xFF90A4AE)
                                : const Color(0xFFCD7F32);
                        return Container(
                          margin: const EdgeInsets.only(bottom: 10),
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAF8),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFE2EDE4)),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 15,
                                backgroundColor: rankColor,
                                child: Text(
                                  '#$rank',
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w800,
                                    color: Colors.white,
                                  ),
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
                                        fontSize: 13,
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
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  Text(
                                    '${u['resolved']} Resolved',
                                    style: GoogleFonts.inter(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: const Color(0xFF1A6B3C),
                                    ),
                                  ),
                                  Text(
                                    '${u['activeTeams']} Teams',
                                    style: GoogleFonts.inter(
                                      fontSize: 11,
                                      color: Colors.grey[500],
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        );
                      }),
                    ],
                  ),
                ),

                const SizedBox(height: 24),
              ]),
            ),
          ),
        ],
      ),
    );
  }
}

class _BannerButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final bool filled;

  const _BannerButton({
    required this.label,
    required this.icon,
    required this.onTap,
    required this.filled,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          decoration: BoxDecoration(
            color: filled ? Colors.white : Colors.white.withOpacity(0.12),
            borderRadius: BorderRadius.circular(10),
            border: filled ? null : Border.all(color: Colors.white.withOpacity(0.25)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 14,
                color: filled ? const Color(0xFF1A6B3C) : Colors.white,
              ),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  label,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: filled ? const Color(0xFF1A6B3C) : Colors.white,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
