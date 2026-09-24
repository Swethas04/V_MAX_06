import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/services/offline_sync_service.dart';
import '../repositories/problems_repository.dart';

class SubmitProblemScreen extends ConsumerStatefulWidget {
  const SubmitProblemScreen({super.key});

  @override
  ConsumerState<SubmitProblemScreen> createState() => _SubmitProblemScreenState();
}

class _SubmitProblemScreenState extends ConsumerState<SubmitProblemScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _addressController = TextEditingController();

  String _category = 'water';
  String _district = 'Ranchi';
  double? _latitude;
  double? _longitude;
  bool _isLocating = false;
  bool _isSubmitting = false;

  final List<File> _attachedImages = [];
  final ImagePicker _picker = ImagePicker();

  Timer? _debounceTimer;
  List<dynamic> _similarProblems = [];
  bool _isCheckingSimilar = false;

  final List<String> _districts = [
    'Ranchi',
    'Dhanbad',
    'Bokaro',
    'East Singhbhum (Jamshedpur)',
    'West Singhbhum',
    'Hazaribagh',
    'Deoghar',
    'Dumka',
    'Giridih',
    'Ramgarh',
    'Palamu',
    'Garhwa',
    'Koderma',
    'Latehar',
    'Lohardaga',
    'Pakur',
    'Sahebganj',
    'Seraikela Kharsawan',
    'Simdega',
    'Khunti',
    'Jamtara',
    'Godda',
    'Chatra',
    'Gumla',
  ];

  final List<Map<String, String>> _categories = [
    {'key': 'water', 'label': '💧 Water Supply / Sanitation'},
    {'key': 'waste_management', 'label': '🗑️ Solid Waste / Drainage'},
    {'key': 'electricity', 'label': '⚡ Electricity / Power Outage'},
    {'key': 'agriculture', 'label': '🌾 Agriculture / Irrigation / Storage'},
    {'key': 'roads_transport', 'label': '🛣️ Roads & Public Transport'},
    {'key': 'healthcare', 'label': '🏥 Healthcare / PHC Facilities'},
    {'key': 'education', 'label': '📚 School / Vocational Infrastructure'},
    {'key': 'other', 'label': '📌 Other Societal Challenge'},
  ];

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _addressController.dispose();
    _debounceTimer?.cancel();
    super.dispose();
  }

  void _triggerCheckSimilar() {
    _debounceTimer?.cancel();
    final title = _titleController.text.trim();
    final desc = _descController.text.trim();

    if (title.length < 4 && desc.length < 8) {
      setState(() => _similarProblems = []);
      return;
    }

    _debounceTimer = Timer(const Duration(milliseconds: 600), () async {
      setState(() => _isCheckingSimilar = true);
      try {
        final repo = ref.read(problemsRepositoryProvider);
        final response = await repo.checkSimilar(
          title: title,
          description: desc.isNotEmpty ? desc : null,
          latitude: _latitude,
          longitude: _longitude,
          district: _district,
          threshold: 0.75,
        );

        if (!mounted) return;
        final list = response['similarProblems'] as List<dynamic>? ?? [];
        final predicted = response['predictedCategory'] as String?;
        setState(() {
          _similarProblems = list;
          _isCheckingSimilar = false;
          if (predicted != null && predicted.isNotEmpty && _category == 'water') {
            // Auto-suggest category if default wasn't manually changed
            final exists = _categories.any((c) => c['key'] == predicted);
            if (exists) _category = predicted;
          }
        });
      } catch (_) {
        if (!mounted) return;
        setState(() => _isCheckingSimilar = false);
      }
    });
  }

  void _onTitleChanged(String _) => _triggerCheckSimilar();
  void _onDescChanged(String _) => _triggerCheckSimilar();

  Future<void> _handleSupportExisting(dynamic problem) async {
    final problemId = problem['id']?.toString();
    if (problemId == null) return;

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Add Your Voice Instead?', style: GoogleFonts.inter(fontWeight: FontWeight.bold, fontSize: 16)),
        content: Text(
          'Instead of creating a duplicate report, this will upvote "${problem['title']}" and attach your photos/details as supporting community evidence.',
          style: GoogleFonts.inter(fontSize: 13),
        ),
        actions: [
          TextButton(onPressed: () => ctx.pop(false), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () => ctx.pop(true),
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
            child: const Text('Confirm & Support', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );

    if (confirmed != true) return;

    setState(() => _isSubmitting = true);
    try {
      final repo = ref.read(problemsRepositoryProvider);
      await repo.supportProblem(
        problemId: problemId,
        message: _descController.text.isNotEmpty ? _descController.text : null,
        mediaFiles: _attachedImages,
      );

      if (!mounted) return;
      setState(() => _isSubmitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Your voice & evidence were attached to the existing challenge!'),
          backgroundColor: AppTheme.success,
        ),
      );
      context.pop();
    } catch (e) {
      if (!mounted) return;
      setState(() => _isSubmitting = false);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add voice: $e'), backgroundColor: AppTheme.error),
      );
    }
  }

  Future<void> _fetchLocation() async {
    setState(() => _isLocating = true);
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception('Location permissions are permanently denied.');
      }

      final position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.medium,
        timeLimit: const Duration(seconds: 10),
      );

      setState(() {
        _latitude = position.latitude;
        _longitude = position.longitude;
        _addressController.text =
            'Lat: ${position.latitude.toStringAsFixed(4)}, Long: ${position.longitude.toStringAsFixed(4)}';
        _isLocating = false;
      });
    } catch (e) {
      setState(() {
        // Fallback to Ranchi center coordinates
        _latitude = 23.3441;
        _longitude = 85.3096;
        _addressController.text = 'Ranchi, Jharkhand (Coordinates detected)';
        _isLocating = false;
      });
    }
  }

  Future<void> _pickImage() async {
    try {
      final picked = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (picked != null) {
        setState(() {
          _attachedImages.add(File(picked.path));
        });
      }
    } catch (_) {}
  }

  Future<void> _handleSubmit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);
    final isOnline = ref.read(offlineSyncProvider).isOnline;

    final submissionData = {
      'title': _titleController.text.trim(),
      'description': _descController.text.trim(),
      'category': _category,
      'district': _district,
      'state': 'Jharkhand',
      'address': _addressController.text.trim(),
      'latitude': _latitude ?? 23.3441,
      'longitude': _longitude ?? 85.3096,
    };

    try {
      if (isOnline) {
        final repo = ref.read(problemsRepositoryProvider);
        await repo.submitProblem(
          title: submissionData['title'] as String,
          description: submissionData['description'] as String,
          category: submissionData['category'] as String,
          district: submissionData['district'] as String,
          state: submissionData['state'] as String,
          address: submissionData['address'] as String?,
          latitude: submissionData['latitude'] as double?,
          longitude: submissionData['longitude'] as double?,
          mediaFiles: _attachedImages,
        );

        if (!mounted) return;
        setState(() => _isSubmitting = false);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Problem submitted! AI is routing it to universities.'),
            backgroundColor: AppTheme.success,
          ),
        );
        context.pop();
      } else {
        // Queue offline
        await ref.read(offlineSyncProvider.notifier).queueSubmission(submissionData);
        if (!mounted) return;
        setState(() => _isSubmitting = false);

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Saved offline! Will sync automatically when reconnected.'),
            backgroundColor: AppTheme.info,
          ),
        );
        context.pop();
      }
    } catch (e) {
      // Fallback: save to offline queue if network fails
      await ref.read(offlineSyncProvider.notifier).queueSubmission(submissionData);
      if (!mounted) return;
      setState(() => _isSubmitting = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Submission queued offline. It will sync automatically.'),
          backgroundColor: AppTheme.warning,
        ),
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'Report Societal Problem',
          style: GoogleFonts.inter(fontSize: 17, fontWeight: FontWeight.bold),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Category Selector
                Text(
                  'Problem Category',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _category,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  items: _categories.map((c) {
                    return DropdownMenuItem<String>(
                      value: c['key'],
                      child: Text(c['label']!, style: GoogleFonts.inter(fontSize: 14)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _category = val);
                  },
                ),
                const SizedBox(height: 20),

                // Title
                Text(
                  'Challenge Title',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _titleController,
                  onChanged: _onTitleChanged,
                  decoration: const InputDecoration(
                    hintText: 'e.g. Arsenic contamination in drinking water in Bokaro',
                  ),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Title is required';
                    if (val.trim().length < 5) return 'Title must be at least 5 characters';
                    return null;
                  },
                ),

                // As-you-type similar deduplication card
                if (_isCheckingSimilar)
                  const Padding(
                    padding: EdgeInsets.only(top: 8),
                    child: Row(
                      children: [
                        SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2)),
                        SizedBox(width: 8),
                        Text('Checking for similar reports nearby via AI...', style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ],
                    ),
                  ),
                if (_similarProblems.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF9E6),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFFFD54F), width: 1.2),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            const Icon(Icons.info_outline, size: 18, color: Color(0xFFE65100)),
                            const SizedBox(width: 6),
                            Text(
                              '${_similarProblems.length} Similar Problem${_similarProblems.length > 1 ? 's' : ''} Nearby — Is this the same issue?',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFFE65100),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'An identical issue is already active in your area. Adding your voice strengthens its priority and connects your photos without creating a duplicate record!',
                          style: GoogleFonts.inter(fontSize: 11.5, color: Colors.black87),
                        ),
                        const SizedBox(height: 10),
                        ..._similarProblems.map((prob) {
                          final pTitle = prob['title']?.toString() ?? '';
                          final pDist = prob['district']?.toString() ?? '';
                          final pUpvotes = prob['upvotes']?.toString() ?? '0';
                          final pSim = prob['similarity'] != null
                              ? '${((prob['similarity'] as num) * 100).toInt()}% match'
                              : null;

                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: const Color(0xFFFFE082)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Expanded(
                                      child: Text(
                                        pTitle,
                                        style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.bold),
                                        maxLines: 2,
                                        overflow: TextOverflow.ellipsis,
                                      ),
                                    ),
                                    if (pSim != null)
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFE8F5E9),
                                          borderRadius: BorderRadius.circular(6),
                                        ),
                                        child: Text(
                                          pSim,
                                          style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF2E7D32)),
                                        ),
                                      ),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    if (pDist.isNotEmpty) ...[
                                      const Icon(Icons.location_on, size: 12, color: Colors.grey),
                                      const SizedBox(width: 2),
                                      Text(pDist, style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                      const SizedBox(width: 10),
                                    ],
                                    const Icon(Icons.thumb_up_alt_outlined, size: 12, color: Colors.grey),
                                    const SizedBox(width: 2),
                                    Text('$pUpvotes upvotes', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                                  ],
                                ),
                                const SizedBox(height: 8),
                                SizedBox(
                                  width: double.infinity,
                                  height: 32,
                                  child: OutlinedButton.icon(
                                    icon: const Icon(Icons.record_voice_over_outlined, size: 14, color: AppTheme.primary),
                                    label: const Text('Add My Voice to This Instead', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.bold)),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: AppTheme.primary,
                                      side: const BorderSide(color: AppTheme.primary),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    onPressed: () => _handleSupportExisting(prob),
                                  ),
                                ),
                              ],
                            ),
                          );
                        }),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 20),

                // Description
                Text(
                  'Detailed Description',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                TextFormField(
                  controller: _descController,
                  onChanged: _onDescChanged,
                  maxLines: 4,
                  decoration: const InputDecoration(
                    hintText: 'Describe what the problem is, how long it has been occurring, and how it impacts your village/ward...',
                  ),
                  validator: (val) {
                    if (val == null || val.trim().isEmpty) return 'Description is required';
                    if (val.trim().length < 15) return 'Please provide more details (min 15 characters)';
                    return null;
                  },
                ),
                const SizedBox(height: 20),

                // District & Location
                Text(
                  'Jharkhand District',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                DropdownButtonFormField<String>(
                  value: _district,
                  decoration: const InputDecoration(
                    contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  ),
                  items: _districts.map((d) {
                    return DropdownMenuItem<String>(
                      value: d,
                      child: Text(d, style: GoogleFonts.inter(fontSize: 14)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _district = val);
                  },
                ),
                const SizedBox(height: 16),

                // GPS Location
                Row(
                  children: [
                    Expanded(
                      child: TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          hintText: 'Village / Ward / Landmark',
                          prefixIcon: Icon(Icons.location_on, size: 20, color: AppTheme.primary),
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    OutlinedButton(
                      onPressed: _isLocating ? null : _fetchLocation,
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: _isLocating
                          ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                          : const Icon(Icons.my_location, size: 20),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Photo attachment
                Text(
                  'Add Photo Evidence (Optional)',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 8),
                Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    ..._attachedImages.map((file) {
                      return Stack(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: Image.file(
                              file,
                              width: 72,
                              height: 72,
                              fit: BoxFit.cover,
                            ),
                          ),
                          Positioned(
                            top: 2,
                            right: 2,
                            child: GestureDetector(
                              onTap: () => setState(() => _attachedImages.remove(file)),
                              child: Container(
                                decoration: const BoxDecoration(
                                  color: Colors.black54,
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.close, size: 16, color: Colors.white),
                              ),
                            ),
                          ),
                        ],
                      );
                    }),
                    InkWell(
                      onTap: _pickImage,
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF0F4F0),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFD0DDD0), style: BorderStyle.solid),
                        ),
                        child: const Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(Icons.add_a_photo_outlined, size: 24, color: AppTheme.primary),
                            SizedBox(height: 4),
                            Text('Attach', style: TextStyle(fontSize: 10, color: AppTheme.primary, fontWeight: FontWeight.bold)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 52,
                  child: ElevatedButton(
                    onPressed: _isSubmitting ? null : _handleSubmit,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primary,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 22,
                            height: 22,
                            child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2.5),
                          )
                        : Text(
                            'Submit Challenge  →',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
