import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter/material.dart';

import '../../features/auth/screens/login_screen.dart';
import '../../features/auth/screens/otp_screen.dart';
import '../../features/auth/screens/role_selection_screen.dart';
import '../../features/citizen/screens/citizen_home_screen.dart';
import '../../features/citizen/screens/submit_problem_screen.dart';
import '../../features/citizen/screens/problem_status_screen.dart';
import '../../features/citizen/screens/my_submissions_screen.dart';
import '../../features/student/screens/student_home_screen.dart';
import '../../features/faculty/screens/faculty_home_screen.dart';
import '../../features/industry/screens/industry_home_screen.dart';
import '../../features/dashboard/screens/dashboard_shell.dart';
import '../../features/auth/providers/auth_provider.dart';
import '../storage/hive_boxes.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    debugLogDiagnostics: true,
    initialLocation: '/login',
    redirect: (context, state) {
      final isLoggedIn = authState.token != null;
      final isOnAuth = state.matchedLocation.startsWith('/login') ||
          state.matchedLocation.startsWith('/otp') ||
          state.matchedLocation.startsWith('/role-select');

      if (!isLoggedIn && !isOnAuth) return '/login';
      if (isLoggedIn && isOnAuth && state.matchedLocation == '/login') {
        return _homeForRole(authState.role);
      }
      return null;
    },
    routes: [
      // ─── Auth routes ──────────────────────────────────────
      GoRoute(path: '/login', builder: (ctx, state) => const LoginScreen()),
      GoRoute(
        path: '/otp',
        builder: (ctx, state) {
          final phone = state.extra as String? ?? '';
          return OtpScreen(phone: phone);
        },
      ),
      GoRoute(path: '/role-select', builder: (ctx, state) => const RoleSelectionScreen()),

      // ─── Citizen / Dashboard routes ────────────────────────
      GoRoute(
        path: '/citizen',
        builder: (ctx, state) => const DashboardShell(),
        routes: [
          GoRoute(path: 'submit', builder: (ctx, state) => const SubmitProblemScreen()),
          GoRoute(path: 'submissions', builder: (ctx, state) => const MySubmissionsScreen()),
          GoRoute(
            path: 'problem/:id',
            builder: (ctx, state) {
              final id = state.pathParameters['id']!;
              return ProblemStatusScreen(problemId: id);
            },
          ),
        ],
      ),

      // ─── Dashboard shell (standalone) ─────────────────────
      GoRoute(path: '/dashboard', builder: (ctx, state) => const DashboardShell()),

      // ─── Student routes ───────────────────────────────────
      GoRoute(path: '/student', builder: (ctx, state) => const StudentHomeScreen()),

      // ─── Faculty routes ───────────────────────────────────
      GoRoute(path: '/faculty', builder: (ctx, state) => const FacultyHomeScreen()),

      // ─── Industry routes ──────────────────────────────────
      GoRoute(path: '/industry', builder: (ctx, state) => const IndustryHomeScreen()),
    ],
    errorBuilder: (ctx, state) => Scaffold(
      body: Center(
        child: Text('Page not found: ${state.error}'),
      ),
    ),
  );
});

String _homeForRole(String? role) {
  switch (role) {
    case 'student': return '/student';
    case 'faculty': return '/faculty';
    case 'industry_partner': return '/industry';
    case 'admin': return '/dashboard';
    default: return '/citizen';
  }
}
