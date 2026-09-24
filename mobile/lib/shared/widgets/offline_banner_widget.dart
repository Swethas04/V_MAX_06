import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class OfflineBannerWidget extends StatelessWidget {
  final bool isOffline;
  final int pendingCount;
  final VoidCallback? onSyncTap;

  const OfflineBannerWidget({
    super.key,
    required this.isOffline,
    this.pendingCount = 0,
    this.onSyncTap,
  });

  @override
  Widget build(BuildContext context) {
    if (!isOffline && pendingCount == 0) return const SizedBox.shrink();

    final isOnlyPending = !isOffline && pendingCount > 0;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      color: isOnlyPending ? AppTheme.info : const Color(0xFFE65100),
      child: Row(
        children: [
          Icon(
            isOffline ? Icons.wifi_off_rounded : Icons.sync_rounded,
            color: Colors.white,
            size: 16,
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              isOffline
                  ? (pendingCount > 0
                      ? 'Offline Mode ($pendingCount reports queued to sync)'
                      : 'Offline Mode • Submissions saved locally')
                  : '$pendingCount reports queued for sync',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ),
          if (onSyncTap != null && !isOffline)
            GestureDetector(
              onTap: onSyncTap,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'Sync Now',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
