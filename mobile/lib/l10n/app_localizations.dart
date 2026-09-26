import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;
  AppLocalizations(this.locale);

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations) ??
        AppLocalizations(const Locale('en', 'IN'));
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static final Map<String, Map<String, String>> _localizedValues = {
    'en': {
      'appName': 'SANKALP',
      'tagline': 'Bridging Citizen Problems to Academic & Industry Solutions',
      'loginTitle': 'Welcome to SANKALP',
      'loginSubtitle': 'Enter your mobile number to get started',
      'phoneHint': '10-digit mobile number',
      'sendOtp': 'Get OTP',
      'verifyOtp': 'Verify OTP',
      'enterOtp': 'Enter the 6-digit code sent to',
      'resendOtp': 'Resend OTP',
      'resendIn': 'Resend in',
      'seconds': 's',
      'selectRoleTitle': 'Who are you?',
      'selectRoleSubtitle': 'Choose how you will participate in the innovation ecosystem',
      'roleCitizen': 'Citizen / Nagrik',
      'roleCitizenDesc': 'Report societal challenges, water, electricity, civic issues',
      'roleStudent': 'Student Innovator',
      'roleStudentDesc': 'Work on real-world projects, build prototypes & earn credits',
      'roleFaculty': 'Faculty Mentor',
      'roleFacultyDesc': 'Guide student projects, research collaboration & grant validation',
      'roleIndustry': 'Industry / CSR Partner',
      'roleIndustryDesc': 'Fund impactful projects, adopt MVPs & mentor tech talent',
      'continueBtn': 'Continue',
      'submitProblem': 'Report Problem',
      'mySubmissions': 'My Reports',
      'browseProblems': 'Browse Problems',
      'searchHint': 'Search challenges by keyword...',
      'offlineMode': 'Offline Mode - Reports will auto-sync when online',
      'titleRequired': 'Title is required',
      'descRequired': 'Description is required',
      'category': 'Category',
      'location': 'Location',
      'fetchLocation': 'Detect Current Location',
      'voiceNote': 'Record Voice Description (Hindi/English)',
      'submitSuccess': 'Problem submitted successfully!',
      'statusSubmitted': 'Submitted',
      'statusClassified': 'AI Classified',
      'statusAssigned': 'Assigned to College',
      'statusInProgress': 'Under Innovation',
      'statusPrototype': 'Prototype Ready',
      'statusPilot': 'Field Pilot Testing',
      'statusResolved': 'Resolved & Impactful',
    },
    'hi': {
      'appName': 'संकल्प (SANKALP)',
      'tagline': 'नागरिक समस्याओं का शैक्षणिक एवं औद्योगिक संकल्प मंच',
      'loginTitle': 'संकल्प (SANKALP) में आपका स्वागत है',
      'loginSubtitle': 'शुरू करने के लिए अपना मोबाइल नंबर दर्ज करें',
      'phoneHint': '10 अंकों का मोबाइल नंबर',
      'sendOtp': 'ओटीपी प्राप्त करें',
      'verifyOtp': 'ओटीपी सत्यापित करें',
      'enterOtp': 'भेजे गए 6-अंकीय कोड को दर्ज करें',
      'resendOtp': 'ओटीपी पुनः भेजें',
      'resendIn': 'पुनः भेजें',
      'seconds': 'सेकंड में',
      'selectRoleTitle': 'आपकी भूमिका क्या है?',
      'selectRoleSubtitle': 'नवाचार पारिस्थितिकी तंत्र में अपनी भागीदारी चुनें',
      'roleCitizen': 'नागरिक',
      'roleCitizenDesc': 'नागरिक, जल, बिजली या अन्य जनसमस्याएं दर्ज करें',
      'roleStudent': 'छात्र अन्वेषक',
      'roleStudentDesc': 'वास्तविक समस्याओं पर प्रोटोटाइप बनाएं और क्रेडिट पाएं',
      'roleFaculty': 'संकाय मार्गदर्शक (फैकल्टी)',
      'roleFacultyDesc': 'शोध व छात्र नवाचार का मार्गदर्शन और अनुदान सत्यापन',
      'roleIndustry': 'उद्योग / सीएसआर साझेदार',
      'roleIndustryDesc': 'सार्थक परियोजनाओं को वित्तपोषित करें और समाधान अपनाएं',
      'continueBtn': 'आगे बढ़ें',
      'submitProblem': 'समस्या दर्ज करें',
      'mySubmissions': 'मेरी शिकायतें व सुझाव',
      'browseProblems': 'समस्याएं खोजें',
      'searchHint': 'समस्या खोजें...',
      'offlineMode': 'ऑफ़लाइन मोड - ऑनलाइन होने पर स्वतः सिंक होगा',
      'titleRequired': 'शीर्षक आवश्यक है',
      'descRequired': 'विवरण आवश्यक है',
      'category': 'श्रेणी',
      'location': 'स्थान',
      'fetchLocation': 'वर्तमान स्थान खोजें',
      'voiceNote': 'आवाज में विवरण रिकॉर्ड करें',
      'submitSuccess': 'समस्या सफलतापूर्वक दर्ज हो गई!',
      'statusSubmitted': 'दर्ज की गई',
      'statusClassified': 'एआई द्वारा वर्गीकृत',
      'statusAssigned': 'संस्थान को सौंपा गया',
      'statusInProgress': 'विकासशील',
      'statusPrototype': 'प्रोटोटाइप तैयार',
      'statusPilot': 'फील्ड परीक्षण',
      'statusResolved': 'समाधान पूर्ण',
    },
  };

  String get(String key) {
    final lang = locale.languageCode;
    return _localizedValues[lang]?[key] ??
        _localizedValues['en']?[key] ??
        key;
  }

  String get appName => get('appName');
  String get tagline => get('tagline');
  String get loginTitle => get('loginTitle');
  String get loginSubtitle => get('loginSubtitle');
  String get phoneHint => get('phoneHint');
  String get sendOtp => get('sendOtp');
  String get verifyOtp => get('verifyOtp');
  String get enterOtp => get('enterOtp');
  String get resendOtp => get('resendOtp');
  String get selectRoleTitle => get('selectRoleTitle');
  String get selectRoleSubtitle => get('selectRoleSubtitle');
  String get continueBtn => get('continueBtn');
  String get submitProblem => get('submitProblem');
  String get mySubmissions => get('mySubmissions');
  String get browseProblems => get('browseProblems');
  String get searchHint => get('searchHint');
  String get offlineMode => get('offlineMode');
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['en', 'hi'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(AppLocalizations(locale));
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
