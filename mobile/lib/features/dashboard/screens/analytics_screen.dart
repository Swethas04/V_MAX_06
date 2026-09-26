import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../../shared/data/mock_data.dart';

class AnalyticsScreen extends StatefulWidget {
  const AnalyticsScreen({super.key});

  @override
  State<AnalyticsScreen> createState() => _AnalyticsScreenState();
}

class _AnalyticsScreenState extends State<AnalyticsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
        backgroundColor: const Color(0xFF1A6B3C),
        title: Text(
          'Analytics',
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: Colors.white,
          ),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700),
          tabs: const [
            Tab(text: 'Pipeline'),
            Tab(text: 'Trends'),
            Tab(text: 'Submitters'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Top Metric Cards
          Padding(
            padding: const EdgeInsets.fromLTRB(12, 14, 12, 0),
            child: SizedBox(
              height: 90,
              child: ListView(
                scrollDirection: Axis.horizontal,
                children: [
                  _MetricCard(
                    label: 'Avg. AI Routing',
                    value: '< 2.8s',
                    sub: 'Embedding & match',
                    color: const Color(0xFF1A6B3C),
                    icon: Icons.access_time,
                  ),
                  const SizedBox(width: 10),
                  _MetricCard(
                    label: 'Institutional Signal',
                    value: '40.8%',
                    sub: 'PRI, ULBs & Govt',
                    color: const Color(0xFFE65100),
                    icon: Icons.emoji_events_outlined,
                  ),
                  const SizedBox(width: 10),
                  _MetricCard(
                    label: 'Conversion to MVP',
                    value: '36.1%',
                    sub: 'Assigned → Prototype',
                    color: const Color(0xFF1565C0),
                    icon: Icons.trending_up,
                  ),
                  const SizedBox(width: 10),
                  _MetricCard(
                    label: 'Ground Verification',
                    value: '88.9%',
                    sub: 'Citizen satisfaction',
                    color: const Color(0xFF2E7D32),
                    icon: Icons.check_circle_outline,
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                _PipelineTab(),
                _TrendsTab(),
                _SubmittersTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Pipeline Tab ──────────────────────────────────────────────────────────────
class _PipelineTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final maxCount = mockPipeline.fold<int>(
        0, (m, e) => (e['count'] as int) > m ? (e['count'] as int) : m);

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionHeader(
            title: '7-Stage Innovation Pipeline',
            subtitle: 'Lifecycle from citizen intake to ground deployment',
          ),
          const SizedBox(height: 16),
          Container(
            decoration: _cardDecor(),
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 10),
            child: SizedBox(
              height: 260,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: (maxCount * 1.2).toDouble(),
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: const Color(0xFFEDF2ED),
                      strokeWidth: 1,
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final i = value.toInt();
                          if (i < 0 || i >= mockPipeline.length) return const SizedBox();
                          return Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: RotatedBox(
                              quarterTurns: 1,
                              child: Text(
                                mockPipeline[i]['stage'] as String,
                                style: GoogleFonts.inter(
                                  fontSize: 9,
                                  color: Colors.grey[600],
                                ),
                              ),
                            ),
                          );
                        },
                        reservedSize: 60,
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 32,
                        getTitlesWidget: (value, meta) => Text(
                          value.toInt().toString(),
                          style: GoogleFonts.inter(fontSize: 9, color: Colors.grey[500]),
                        ),
                      ),
                    ),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  barGroups: List.generate(mockPipeline.length, (i) {
                    final item = mockPipeline[i];
                    return BarChartGroupData(
                      x: i,
                      barRods: [
                        BarChartRodData(
                          toY: (item['count'] as int).toDouble(),
                          color: Color(item['colorVal'] as int),
                          width: 20,
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(6)),
                        ),
                      ],
                    );
                  }),
                ),
              ),
            ),
          ),

          const SizedBox(height: 20),
          // Category horizontal bar
          _SectionHeader(
            title: 'Category Distribution',
            subtitle: 'Challenges segmented by societal domain',
          ),
          const SizedBox(height: 12),
          Container(
            decoration: _cardDecor(),
            padding: const EdgeInsets.all(16),
            child: Column(
              children: mockCategories.map((c) {
                final pct = (c['count'] as int) / 46.0;
                final col = Color(c['colorVal'] as int);
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    children: [
                      SizedBox(
                        width: 110,
                        child: Text(
                          c['category'] as String,
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF1A2420),
                          ),
                        ),
                      ),
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: pct,
                            backgroundColor: const Color(0xFFEDF2ED),
                            valueColor: AlwaysStoppedAnimation(col),
                            minHeight: 12,
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${c['count']}',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w700,
                          color: col,
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}

// ── Trends Tab ────────────────────────────────────────────────────────────────
class _TrendsTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final spots1 = <FlSpot>[];
    final spots2 = <FlSpot>[];
    final spots3 = <FlSpot>[];
    for (var i = 0; i < mockMonthlyTrends.length; i++) {
      final t = mockMonthlyTrends[i];
      spots1.add(FlSpot(i.toDouble(), (t['submissions'] as int).toDouble()));
      spots2.add(FlSpot(i.toDouble(), (t['prototypes'] as int).toDouble()));
      spots3.add(FlSpot(i.toDouble(), (t['resolved'] as int).toDouble()));
    }
    final months = mockMonthlyTrends.map((t) => t['month'] as String).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionHeader(
            title: 'Innovation Velocity',
            subtitle: 'Monthly acceleration of prototypes & resolutions',
          ),
          const SizedBox(height: 16),
          Container(
            decoration: _cardDecor(),
            padding: const EdgeInsets.fromLTRB(8, 20, 16, 10),
            child: SizedBox(
              height: 280,
              child: LineChart(
                LineChartData(
                  gridData: FlGridData(
                    show: true,
                    drawVerticalLine: false,
                    getDrawingHorizontalLine: (_) => FlLine(
                      color: const Color(0xFFEDF2ED),
                      strokeWidth: 1,
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  titlesData: FlTitlesData(
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final i = value.toInt();
                          if (i < 0 || i >= months.length) return const SizedBox();
                          return Text(
                            months[i],
                            style: GoogleFonts.inter(fontSize: 10, color: Colors.grey[600]),
                          );
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 32,
                        getTitlesWidget: (value, meta) => Text(
                          value.toInt().toString(),
                          style: GoogleFonts.inter(fontSize: 9, color: Colors.grey[500]),
                        ),
                      ),
                    ),
                    topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                    rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  ),
                  lineBarsData: [
                    LineChartBarData(
                      spots: spots1,
                      isCurved: true,
                      color: const Color(0xFF1565C0),
                      barWidth: 2.5,
                      dotData: const FlDotData(show: false),
                    ),
                    LineChartBarData(
                      spots: spots2,
                      isCurved: true,
                      color: const Color(0xFFE65100),
                      barWidth: 2.5,
                      dotData: const FlDotData(show: false),
                    ),
                    LineChartBarData(
                      spots: spots3,
                      isCurved: true,
                      color: const Color(0xFF2E7D32),
                      barWidth: 2.5,
                      dotData: const FlDotData(show: false),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 12),
          // Legend
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _LegendDot(color: const Color(0xFF1565C0), label: 'Intake Reports'),
              const SizedBox(width: 16),
              _LegendDot(color: const Color(0xFFE65100), label: 'Prototypes'),
              const SizedBox(width: 16),
              _LegendDot(color: const Color(0xFF2E7D32), label: 'Resolved'),
            ],
          ),

          const SizedBox(height: 20),
          _SectionHeader(
            title: 'Monthly Data Table',
            subtitle: 'Detailed breakdown per month',
          ),
          const SizedBox(height: 12),
          Container(
            decoration: _cardDecor(),
            child: Table(
              columnWidths: const {
                0: FlexColumnWidth(1),
                1: FlexColumnWidth(1.2),
                2: FlexColumnWidth(1),
                3: FlexColumnWidth(1),
              },
              children: [
                TableRow(
                  decoration: const BoxDecoration(
                    color: Color(0xFFF8FAF8),
                    borderRadius: BorderRadius.vertical(top: Radius.circular(14)),
                  ),
                  children: ['Month', 'Submissions', 'Prototypes', 'Resolved']
                      .map(
                        (h) => Padding(
                          padding: const EdgeInsets.all(12),
                          child: Text(
                            h,
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: Colors.grey[600],
                            ),
                          ),
                        ),
                      )
                      .toList(),
                ),
                ...mockMonthlyTrends.map(
                  (t) => TableRow(
                    decoration: const BoxDecoration(
                      border: Border(top: BorderSide(color: Color(0xFFEDF2ED))),
                    ),
                    children: [
                      _TableCell(t['month'] as String),
                      _TableCellNum('${t['submissions']}', const Color(0xFF1565C0)),
                      _TableCellNum('${t['prototypes']}', const Color(0xFFE65100)),
                      _TableCellNum('${t['resolved']}', const Color(0xFF2E7D32)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── Submitters Tab ────────────────────────────────────────────────────────────
class _SubmittersTab extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final total = mockSubmitters.fold<int>(0, (s, e) => s + (e['count'] as int));

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionHeader(
            title: 'Submitter-Type Authority Breakdown',
            subtitle: 'PRI & ULB filings carry higher institutional priority',
          ),
          const SizedBox(height: 16),
          // Pie chart
          Container(
            decoration: _cardDecor(),
            padding: const EdgeInsets.all(16),
            child: SizedBox(
              height: 220,
              child: PieChart(
                PieChartData(
                  sectionsSpace: 3,
                  centerSpaceRadius: 55,
                  sections: mockSubmitters.map((s) {
                    final pct = (s['count'] as int) / total;
                    return PieChartSectionData(
                      value: (s['count'] as int).toDouble(),
                      color: Color(s['colorVal'] as int),
                      radius: 55,
                      title: '${(pct * 100).toStringAsFixed(0)}%',
                      titleStyle: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    );
                  }).toList(),
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          // Submitter cards
          ...mockSubmitters.map((s) {
            final col = Color(s['colorVal'] as int);
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE2EDE4)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.03),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: col.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(Icons.people_outline, color: col, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          s['label'] as String,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF1A2420),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Avg Priority: ${s['avgPriority']}/100',
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
                        '${s['count']}',
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: col,
                        ),
                      ),
                      Text(
                        s['pct'] as String,
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
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
    );
  }
}

// ── Shared Helpers ─────────────────────────────────────────────────────────────
BoxDecoration _cardDecor() => BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
          color: Colors.black.withOpacity(0.04),
          blurRadius: 8,
          offset: const Offset(0, 2),
        ),
      ],
    );

class _SectionHeader extends StatelessWidget {
  final String title;
  final String subtitle;
  const _SectionHeader({required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF1A2420),
            ),
          ),
          Text(
            subtitle,
            style: GoogleFonts.inter(fontSize: 11, color: Colors.grey[500]),
          ),
        ],
      );
}

class _MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final String sub;
  final Color color;
  final IconData icon;
  const _MetricCard({
    required this.label,
    required this.value,
    required this.sub,
    required this.color,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) => Container(
        width: 140,
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(14),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Icon(icon, size: 13, color: color),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    label,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: color,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF1A2420),
              ),
            ),
            Text(
              sub,
              style: GoogleFonts.inter(fontSize: 9.5, color: Colors.grey[500]),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      );
}

class _LegendDot extends StatelessWidget {
  final Color color;
  final String label;
  const _LegendDot({required this.color, required this.label});

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
          ),
          const SizedBox(width: 4),
          Text(label, style: GoogleFonts.inter(fontSize: 11, color: Colors.grey[600])),
        ],
      );
}

class _TableCell extends StatelessWidget {
  final String text;
  const _TableCell(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.all(12),
        child: Text(
          text,
          style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
        ),
      );
}

class _TableCellNum extends StatelessWidget {
  final String text;
  final Color color;
  const _TableCellNum(this.text, this.color);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.all(12),
        child: Text(
          text,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w800,
            color: color,
          ),
        ),
      );
}
