import 'package:hive/hive.dart';

class HiveBoxes {
  static const String authBox = 'auth';
  static const String offlineQueueBox = 'offline_queue';
  static const String problemsBox = 'problems_cache';
  static const String settingsBox = 'settings';

  static Future<void> openAll() async {
    await Hive.openBox(authBox);
    await Hive.openBox(offlineQueueBox);
    await Hive.openBox(problemsBox);
    await Hive.openBox(settingsBox);
  }

  static Box get auth => Hive.box(authBox);
  static Box get offlineQueue => Hive.box(offlineQueueBox);
  static Box get problems => Hive.box(problemsBox);
  static Box get settings => Hive.box(settingsBox);
}
