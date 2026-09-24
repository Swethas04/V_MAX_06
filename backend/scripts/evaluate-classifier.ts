import { ConfigService } from '@nestjs/config';
import { EmbeddingService } from '../src/ai-routing/embedding.service';
import { AiRoutingService } from '../src/ai-routing/ai-routing.service';
import { ProblemCategory } from '../src/problems/problem.entity';

interface EvaluationCase {
  id: number;
  expectedCategory: ProblemCategory;
  language: string;
  title: string;
  description: string;
}

const TEST_CASES: EvaluationCase[] = [
  // 1. WATER (English)
  {
    id: 1,
    expectedCategory: ProblemCategory.WATER,
    language: 'English',
    title: 'Severe Arsenic and Fluoride Contamination in Village Borewells',
    description: 'Groundwater testing showed arsenic levels at 0.08 mg/L in our panchayat borewells. Villagers are suffering from skin lesions and dental fluorosis.',
  },
  // 2. WATER (Hindi)
  {
    id: 2,
    expectedCategory: ProblemCategory.WATER,
    language: 'Hindi',
    title: 'गांव में पीने के पानी का गंभीर संकट और चापाकल खराब',
    description: 'हमारे टोले में सभी 4 सरकारी हैंडपंप पिछले तीन महीने से सूखे पड़े हैं। महिलाओं को 2 किलोमीटर दूर नदी से पानी लाना पड़ रहा है।',
  },
  // 3. ROADS (English)
  {
    id: 3,
    expectedCategory: ProblemCategory.ROADS,
    language: 'English',
    title: 'Collapsed Bridge Cut Off Access to 4 Villages in Dumka',
    description: 'The concrete culvert bridge over the local river collapsed after heavy monsoon rain, preventing ambulances and passenger buses from entering.',
  },
  // 4. ROADS (Hinglish)
  {
    id: 4,
    expectedCategory: ProblemCategory.ROADS,
    language: 'Hinglish',
    title: 'Main road par bahut bade gaddhe aur kichad',
    description: 'Gaon ki mukhya sadak par damar toot chuka hai aur 2 feet deep potholes hain. Baarish me gaadi phas jaati hai aur accident ho rahe hain.',
  },
  // 5. AGRICULTURE (English)
  {
    id: 5,
    expectedCategory: ProblemCategory.AGRICULTURE,
    language: 'English',
    title: 'Severe Drought and Lack of Canal Irrigation Destroying Paddy Harvest',
    description: 'The lift irrigation scheme pump house is non-operational. Over 300 hectares of standing paddy crop is drying up due to rain deficit.',
  },
  // 6. AGRICULTURE (Hindi)
  {
    id: 6,
    expectedCategory: ProblemCategory.AGRICULTURE,
    language: 'Hindi',
    title: 'धान की फसल में कीट प्रकोप और यूरिया खाद की अनुपलब्धता',
    description: 'धान के पौधों में तना छेदक कीट लग गया है और लैंप्स केंद्र पर सब्सिडी वाली यूरिया और डीएपी खाद उपलब्ध नहीं कराई जा रही है।',
  },
  // 7. HEALTHCARE (English)
  {
    id: 7,
    expectedCategory: ProblemCategory.HEALTHCARE,
    language: 'English',
    title: 'PHC Doctor Absent and No Anti-Venom Vials in Block Hospital',
    description: 'The Primary Health Centre has had no MBBS doctor for 6 months. A snake bite victim died yesterday due to lack of anti-rabies and anti-venom injections.',
  },
  // 8. HEALTHCARE (Hindi)
  {
    id: 8,
    expectedCategory: ProblemCategory.HEALTHCARE,
    language: 'Hindi',
    title: 'सामुदायिक स्वास्थ्य केंद्र में एम्बुलेंस और प्रसव वार्ड की सुविधा नहीं',
    description: 'अस्पताल में डिलीवरी रूम बंद पड़ा है और 108 एम्बुलेंस फोन करने पर समय पर नहीं पहुंचती, जिससे गर्भवती महिलाओं को खतरा हो रहा है।',
  },
  // 9. EDUCATION (English)
  {
    id: 9,
    expectedCategory: ProblemCategory.EDUCATION,
    language: 'English',
    title: 'Dilapidated School Building Roof Leaking and Lack of Science Teachers',
    description: 'Government High School has 350 enrolled students but only 2 teachers. The plaster is falling from classroom ceilings and no girls toilet exists.',
  },
  // 10. EDUCATION (Hindi)
  {
    id: 10,
    expectedCategory: ProblemCategory.EDUCATION,
    language: 'Hindi',
    title: 'प्राथमिक विद्यालय में शिक्षक अनुपस्थित और मिड-डे मील की खराब गुणवत्ता',
    description: 'स्कूल में शिक्षक हफ्ते में सिर्फ दो दिन आते हैं और बच्चों को मिलने वाले दोपहर के भोजन में कीड़े निकलते हैं।',
  },
  // 11. ENVIRONMENT (English)
  {
    id: 11,
    expectedCategory: ProblemCategory.ENVIRONMENT,
    language: 'English',
    title: 'Illegal Open-Cast Mining Dust Causing Severe Air Pollution and Smog',
    description: 'Uncovered coal transport dumpers and blast mining without water sprinklers have turned the ambient AQI hazardous, causing widespread asthma.',
  },
  // 12. ENVIRONMENT (Hindi)
  {
    id: 12,
    expectedCategory: ProblemCategory.ENVIRONMENT,
    language: 'Hindi',
    title: 'फैक्ट्री का रासायनिक कचरा दामोदर नदी में बहाने से प्रदूषण',
    description: 'औद्योगिक संयंत्र बिना ट्रीटमेंट के जहरीला काला पानी नदी में छोड़ रहा है, जिससे जलीय जीव मर रहे हैं और बदबू फैल रही है।',
  },
  // 13. URBAN_INFRA (English)
  {
    id: 13,
    expectedCategory: ProblemCategory.URBAN_INFRA,
    language: 'English',
    title: 'Burnt 100kVA Distribution Transformer and Overflowing Open Drainage',
    description: 'The electricity transformer burst 5 days ago leaving 200 households in darkness. Municipal open gutters are choked with trash and overflowing on streets.',
  },
  // 14. URBAN_INFRA (Hinglish)
  {
    id: 14,
    expectedCategory: ProblemCategory.URBAN_INFRA,
    language: 'Hinglish',
    title: 'Mohalle me street lights kharab aur bijli ke nange taar',
    description: 'Poore ward me street light nahi jalti hai raat me andhera rehta hai aur high tension wire neeche latak rahi hai current lagne ka dar hai.',
  },
  // 15. ACCESSIBILITY (English)
  {
    id: 15,
    expectedCategory: ProblemCategory.ACCESSIBILITY,
    language: 'English',
    title: 'No Wheelchair Ramp Access at District Collectorate and Railway Station',
    description: 'Divyang citizens cannot access the administrative building as the staircase has no ramp or elevator. Public counters lack braille signage and tactile tiles.',
  },
  // 16. ACCESSIBILITY (Hindi)
  {
    id: 16,
    expectedCategory: ProblemCategory.ACCESSIBILITY,
    language: 'Hindi',
    title: 'दिव्यांगजनों के लिए अस्पताल और बस स्टैंड पर सुगम्य रैंप की अनुपस्थिति',
    description: 'व्हीलचेयर और दृष्टिबाधित नागरिकों के लिए सुलभ शौचालय, रैंप और ब्रेल संकेत नहीं हैं जिससे दिव्यांग जनों को बहुत परेशानी हो रही है।',
  },
  // 17. LIVELIHOOD (English)
  {
    id: 17,
    expectedCategory: ProblemCategory.LIVELIHOOD,
    language: 'English',
    title: 'Pending MGNREGA Wage Payments for 5 Months and Tribal Artisan Distress',
    description: 'Over 180 rural job card holders have not received their bank wage disbursement. Traditional bamboo weavers lack direct buyer linkages and working capital.',
  },
  // 18. LIVELIHOOD (Hindi)
  {
    id: 18,
    expectedCategory: ProblemCategory.LIVELIHOOD,
    language: 'Hindi',
    title: 'स्थानीय युवाओं में बेरोजगारी और महिला स्वयं सहायता समूह को ऋण समस्या',
    description: 'गांव में कोई कौशल प्रशिक्षण केंद्र नहीं है जिससे युवा पलायन कर रहे हैं और महिला स्वयं सहायता समूहों को बैंक से रिवाल्विंग फंड नहीं मिल रहा।',
  },
  // 19. WATER (Hinglish)
  {
    id: 19,
    expectedCategory: ProblemCategory.WATER,
    language: 'Hinglish',
    title: 'Pani ki pipe line phat gayi hai peene ka paani barbaad ho raha',
    description: 'Nal-Jal yojana ki main supply pipeline leak ho rahi hai aur pichle 10 din se basti me tap dry hai.',
  },
  // 20. ROADS (English)
  {
    id: 20,
    expectedCategory: ProblemCategory.ROADS,
    language: 'English',
    title: 'Landslide Blocked NH-33 Hill Route Between Ranchi and Jamshedpur',
    description: 'Massive rockfall and earth slip have obstructed both lanes of the highway. Heavy trucks and passenger vehicles are stranded for 15 kilometers.',
  },
];

async function runEvaluation() {
  console.log('\n' + '='.repeat(85));
  console.log('  🎯 SAMADHAN SETU — EMBEDDING-BASED PROBLEM CLASSIFIER EVALUATION');
  console.log('='.repeat(85));
  console.log('Initializing embedding engine and theme centroid representations...\n');

  const configService = new ConfigService({
    ai: {
      embeddingMode: process.env.AI_EMBEDDING_MODE || 'transformers',
    },
  });

  const embeddingService = new EmbeddingService(configService);
  await embeddingService.onModuleInit();

  // Mock repositories / datasource for standalone CLI evaluation
  const mockProblemRepo: any = { findOne: async () => null };
  const mockInstitutionRepo: any = { createQueryBuilder: () => ({ getMany: async () => [] }) };
  const mockDataSource: any = { query: async () => [] };

  const aiRoutingService = new AiRoutingService(
    mockProblemRepo,
    mockInstitutionRepo,
    mockDataSource,
    embeddingService,
  );

  await aiRoutingService.initThemeCentroids();

  console.log('\nEvaluating 20 diverse civic & rural problem submissions across 9 themes:\n');
  console.log(
    'ID'.padEnd(4) +
    'Lang'.padEnd(10) +
    'Expected'.padEnd(16) +
    'Predicted'.padEnd(16) +
    'Conf'.padEnd(8) +
    'Status'.padEnd(8) +
    'Title Snippet'
  );
  console.log('-'.repeat(85));

  let passed = 0;
  let totalConfidence = 0;

  for (const tc of TEST_CASES) {
    const textToClassify = `${tc.title}\n${tc.description}`;
    const result = await aiRoutingService.classifyCategory(textToClassify);

    const isMatch = result.category === tc.expectedCategory;
    if (isMatch) passed++;
    totalConfidence += result.confidence;

    const statusStr = isMatch ? '✅ PASS' : '❌ FAIL';
    const confPct = `${Math.round(result.confidence * 100)}%`;
    const snippet = tc.title.length > 32 ? tc.title.slice(0, 29) + '...' : tc.title;

    console.log(
      String(tc.id).padEnd(4) +
      tc.language.padEnd(10) +
      tc.expectedCategory.padEnd(16) +
      result.category.padEnd(16) +
      confPct.padEnd(8) +
      statusStr.padEnd(8) +
      snippet
    );
  }

  const accuracy = (passed / TEST_CASES.length) * 100;
  const meanConf = (totalConfidence / TEST_CASES.length) * 100;

  console.log('-'.repeat(85));
  console.log(`\n📊 EVALUATION SUMMARY:`);
  console.log(`   • Total Test Cases   : ${TEST_CASES.length}`);
  console.log(`   • Correct Predictions: ${passed} / ${TEST_CASES.length}`);
  console.log(`   • Classification Acc : ${accuracy.toFixed(1)}%`);
  console.log(`   • Mean Confidence    : ${meanConf.toFixed(1)}%`);

  if (accuracy >= 90) {
    console.log(`\n🎉 SANITY CHECK PASSED: Classifier is production-ready for Demo Day!\n`);
  } else {
    console.log(`\n⚠️ Accuracy below threshold. Check centroid reference embeddings.\n`);
  }
}

runEvaluation().catch((err) => {
  console.error('Evaluation failed with error:', err);
  process.exit(1);
});
