import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'overview_screen.dart';
import 'analytics_screen.dart';
import 'leaderboard_screen.dart';
import '../../citizen/screens/citizen_home_screen.dart';
import '../../citizen/screens/submit_problem_screen.dart';

class DashboardShell extends StatefulWidget {
  const DashboardShell({super.key});

  @override
  State<DashboardShell> createState() => _DashboardShellState();
}

class _DashboardShellState extends State<DashboardShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    OverviewScreen(),
    AnalyticsScreen(),
    LeaderboardScreen(),
    CitizenHomeScreen(),
  ];

  final _navItems = const [
    BottomNavigationBarItem(
      icon: Icon(Icons.dashboard_outlined),
      activeIcon: Icon(Icons.dashboard),
      label: 'Overview',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.bar_chart_outlined),
      activeIcon: Icon(Icons.bar_chart),
      label: 'Analytics',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.emoji_events_outlined),
      activeIcon: Icon(Icons.emoji_events),
      label: 'Leaderboard',
    ),
    BottomNavigationBarItem(
      icon: Icon(Icons.list_alt_outlined),
      activeIcon: Icon(Icons.list_alt),
      label: 'Problems',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      floatingActionButton: _currentIndex == 3
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => const SubmitProblemScreen(),
                  ),
                );
              },
              backgroundColor: const Color(0xFF1A6B3C),
              icon: const Icon(Icons.add, color: Colors.white),
              label: Text(
                'Submit',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            )
          : null,
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Color(0x14000000),
              blurRadius: 20,
              offset: Offset(0, -4),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (i) => setState(() => _currentIndex = i),
          type: BottomNavigationBarType.fixed,
          selectedItemColor: const Color(0xFF1A6B3C),
          unselectedItemColor: const Color(0xFF8CA897),
          backgroundColor: Colors.white,
          selectedLabelStyle: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w700,
          ),
          unselectedLabelStyle: GoogleFonts.inter(
            fontSize: 11,
            fontWeight: FontWeight.w500,
          ),
          items: _navItems,
        ),
      ),
    );
  }
}
