export interface ShortVideo {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  description: string;
  sector: string;
  sectorLabel: string;
  sectorIcon: string;
  skillTier: string;
  tierLabel: string;
  durationSeconds: number;
  videoUrl: string;
  posterUrl: string;
  likesCount: number;
  machineId?: string;
  machineName?: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  wrongWay: {
    title: string;
    detail: string;
    icon: string;
  };
  rightWay: {
    title: string;
    detail: string;
    icon: string;
  };
  audioNarrations: Record<string, string>; // language code -> text to speak / voiceover
  quiz: {
    id: string;
    question: string;
    options: { text: string; isCorrect: boolean; explanation: string }[];
  };
}

export const SHORTS_DATABASE: ShortVideo[] = [
  {
    id: 'short-const-01',
    courseId: 'course-const-01',
    courseTitle: 'Scaffolding & Working at Heights Safety Masterclass',
    title: '3-Point Contact on Scaffolding Ladders',
    description: 'Never carry heavy tools in your hands while climbing scaffolding ladders. Always maintain 3 points of physical contact.',
    sector: 'CONSTRUCTION',
    sectorLabel: 'Construction',
    sectorIcon: '🏗️',
    skillTier: 'UNSKILLED',
    tierLabel: 'Tier 1: Unskilled',
    durationSeconds: 45,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?w=800&auto=format&fit=crop&q=80',
    likesCount: 1840,
    machineId: 'SCAF-SITE-04',
    machineName: 'Scaffolding Tower Zone B',
    instructor: {
      name: 'Ramesh Patel',
      role: 'Chief Civil Safety Officer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Carrying tool bucket in hand while climbing ladder',
      detail: 'Causes loss of balance and fatal falls from height. Leaves only 1 hand for ladder grip.',
      icon: '❌',
    },
    rightWay: {
      title: 'Use tool belt pouch or pulley hoist line',
      detail: 'Keep 2 feet and 1 hand or 2 hands and 1 foot firmly locked on ladder rungs at all times.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Maintain three points of contact on scaffolding ladders at all times. Use a tool belt or pulley rope to hoist equipment.',
      hi: 'सीढ़ी चढ़ते समय हमेशा 3-पॉइंट संपर्क बनाए रखें। उपकरण ले जाने के लिए टूल बेल्ट या रस्सी का उपयोग करें।',
      te: 'నిచ్చెన ఎక్కేటప్పుడు ఎల్లప్పుడూ 3-పాయింట్ సంపర్కాన్ని నిర్వహించండి. చేతుల్లో బరువులు మోయకండి.',
      ta: 'சாரக்கட்டு ஏணியில் ஏறும் போது எப்போதும் 3-புள்ளி பிடியை வைத்திருங்கள். கைகளில் கருவிகளை தூக்காதீர்கள்.',
      kn: 'ಏಣಿ ಏರುವಾಗ ಯಾವಾಗಲೂ 3-ಪಾಯಿಂಟ್ ಸಂಪರ್ಕವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಿ. ಉಪಕರಣಗಳನ್ನು ಕೈಯಲ್ಲಿ ಕೊಂಡೊಯ್ಯಬೇಡಿ.',
      mr: 'शिडी चढताना नेहमी ३-पॉइंट संपर्क ठेवा. साहित्य नेण्यासाठी टूल बेल्ट वापरा.',
      bn: 'মই ওঠার সময় সর্বদা ৩-পয়েন্ট যোগাযোগ বজায় রাখুন। হাতে ভারি যন্ত্রপাতি বহন করবেন না।',
      gu: 'સીડી ચડતી વખતે હંમેશા 3-પોઇન્ટ સંપર્ક જાળવો. સાધનો માટે ટૂલ બેલ્ટનો ઉપયોગ કરો.',
      ml: 'ഏണി കയറുമ്പോൾ എപ്പോഴും 3-പോയിന്റ് കോൺടാക്റ്റ് നിലനിർത്തുക.',
      pa: 'ਪੌੜੀ ਚੜ੍ਹਦੇ ਸਮੇਂ ਹਮੇਸ਼ਾ 3-ਪੁਆਇੰਟ ਸੰਪਰਕ ਬਣਾ ਕੇ ਰੱਖੋ। ਟੂਲ ਬੈਲਟ ਦੀ ਵਰਤੋਂ ਕਰੋ।',
      or: 'ନିଶୁଣି ଚଢ଼ିବା ସମୟରେ ସର୍ବଦା ୩-ପଏଣ୍ଟ ସମ୍ପର୍କ ବଜାୟ ରଖନ୍ତୁ।',
    },
    quiz: {
      id: 'quiz-const-01',
      question: 'What is the correct protocol when climbing a 6-meter scaffold ladder?',
      options: [
        { text: 'Carry hammer and drill in right hand, climb with left', isCorrect: false, explanation: 'Violates 3-point contact rule.' },
        { text: 'Use tool belt; keep 2 hands and 1 foot on rungs', isCorrect: true, explanation: 'Correct! Both hands remain free for ladder grip.' },
        { text: 'Slide down the vertical scaffolding pipe to save time', isCorrect: false, explanation: 'Extremely dangerous and causes fatal falls.' },
      ],
    },
  },
  {
    id: 'short-log-02',
    courseId: 'course-log-03',
    courseTitle: 'Counterbalance Forklift & Yard Logistics Operator',
    title: 'Forklift Blind Spot & Reverse Horn Protocol',
    description: 'When reversing a forklift loaded with pallets, always sound the horn twice and verify rear ground guide visibility.',
    sector: 'LOGISTICS',
    sectorLabel: 'Logistics & Warehouse',
    sectorIcon: '🚚',
    skillTier: 'SEMI_SKILLED',
    tierLabel: 'Tier 2: Semi-Skilled',
    durationSeconds: 52,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    likesCount: 2310,
    machineId: 'MACH-FORK-04',
    machineName: 'Toyota 3-Ton Counterbalance Forklift',
    instructor: {
      name: 'Vikram Sengupta',
      role: 'Logistics Fleet Superintendent',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Reversing blind without horn honk or rear camera check',
      detail: 'Pedestrians in warehouse aisle blind spots cannot react in time to heavy machine motion.',
      icon: '❌',
    },
    rightWay: {
      title: 'Sound horn twice, turn torso, reverse at <5 km/h',
      detail: 'Ensure pedestrian alert lights are flashing and mirrors are adjusted to elimination blind zones.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Always sound the reverse horn twice before moving backwards in forklift corridors. Never assume pedestrians can see you.',
      hi: 'फोर्कलिफ्ट को पीछे ले जाने से पहले दो बार हॉर्न बजाएं। हमेशा पीछे मुड़कर देखें और गति 5 किमी/घंटा से कम रखें।',
      te: 'ఫోర్క్‌లిఫ్ట్‌ను వెనుకకు తరలించే ముందు రెండుసార్లు హారన్ మోగించండి. పరిసరాలను పరిశీలించండి.',
      ta: 'ஃபோர்க்லிஃப்ட்டை பின்னோக்கி நகர்த்துவதற்கு முன் இரண்டு முறை ஹாரன் அடிக்கவும்.',
      kn: 'ಫೋರ್ಕ್‌ಲಿಫ್ಟ್ ಹಿಂದಕ್ಕೆ ಚಲಿಸುವ ಮೊದಲು ಎರಡು ಬಾರಿ ಹಾರ್ನ್ ಮಾಡಿ.',
      mr: 'फोर्कलिफ्ट मागे घेण्यापूर्वी दोनदा हॉर्न वाजवा आणि वेग नियंत्रित ठेवा.',
      bn: 'ফর্কলিফ্ট পিছন দিকে নেওয়ার আগে দুইবার হর্ন বাজান।',
      gu: 'ફોર્કલિફ્ટ પાછળ લેતા પહેલા બે વાર હોર્ન વગાડો.',
      ml: 'ഫോർക്ക്ലിഫ്റ്റ് പിന്നോട്ട് എടുക്കുന്നതിന് മുമ്പ് രണ്ട് തവണ ഹോൺ മുഴക്കുക.',
      pa: 'ਫੋਰਕਲਿਫਟ ਪਿੱਛੇ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਦੋ ਵਾਰ ਹਾਰਨ ਵਜਾਓ।',
      or: 'ଫୋର୍କଲିଫ୍ଟ ପଛକୁ ନେବା ପୂର୍ବରୁ ଦୁଇଥର ହର୍ଣ୍ଣ ବଜାନ୍ତୁ।',
    },
    quiz: {
      id: 'quiz-log-02',
      question: 'What is the mandatory action before reversing a forklift in a blind aisle?',
      options: [
        { text: 'Speed up quickly to exit the pedestrian zone', isCorrect: false, explanation: 'Increases collision probability.' },
        { text: 'Sound horn twice and verify rear clearance before motion', isCorrect: true, explanation: 'Correct! Warns nearby foot workers.' },
        { text: 'Look only at forward fork tips', isCorrect: false, explanation: 'You must monitor the direction of travel.' },
      ],
    },
  },
  {
    id: 'short-tech-03',
    courseId: 'course-tech-04',
    courseTitle: 'High-Voltage Switchgear & Substation Arc Flash Safety',
    title: 'High-Voltage Breaker Lockout-Tagout (LOTO)',
    description: 'Verify zero electrical energy before opening 415V distribution boards. Affix personal padlock and danger tag.',
    sector: 'SKILLED_TECHNICAL',
    sectorLabel: 'Skilled Technical',
    sectorIcon: '⚡',
    skillTier: 'SKILLED',
    tierLabel: 'Tier 3: Skilled',
    durationSeconds: 60,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    likesCount: 3105,
    machineId: 'ELEC-PNL-88',
    machineName: '415V Main Substation Distribution Panel',
    instructor: {
      name: 'Pooja Sharma',
      role: 'High Voltage Certified Master Electrician',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Relying only on software stop button without physical padlock',
      detail: 'Someone on another shift can remotely restart the machine, causing electrocution or arc blast.',
      icon: '❌',
    },
    rightWay: {
      title: 'Apply physical red padlock + danger tag + test multimeter',
      detail: 'Ensure you hold the only key. Verify zero voltage across all 3 phases before touch.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Always apply your personal padlock and danger tag to the electrical breaker. Never trust just a digital switch.',
      hi: 'इलेक्ट्रिकल ब्रेकर पर हमेशा अपना व्यक्तिगत पैडलॉक और डेंजर टैग लगाएं। डिजिटल स्विच पर भरोसा न करें।',
      te: 'ఎలక్ట్రికల్ బ్రేకర్ వద్ద మీ వ్యక్తిగత ప్యాడ్‌లాక్ మరియు డేంజర్ ట్యాగ్‌ను తప్పనిసరిగా వేయండి.',
      ta: 'மின்சார பிரேக்கரில் உங்கள் தனிப்பட்ட பூட்டை பூட்டி எச்சரிக்கை பலகையை தொங்கவிடவும்.',
      kn: 'ವಿದ್ಯುತ್ ಬ್ರೇಕರ್‌ನಲ್ಲಿ ನಿಮ್ಮ ವೈಯಕ್ತಿಕ ಪ್ಯಾಡ್‌ಲಾಕ್ ಮತ್ತು ಡೇಂಜರ್ ಟ್ಯಾಗ್ ಅಳವಡಿಸಿ.',
      mr: 'इलेक्ट्रिकल पॅनेलवर वैयक्तिक कुलूप आणि डेंजर टॅग लावा. टेस्ट लॅम्पने खात्री करा.',
      bn: 'বৈদ্যুতিক ব্রেকারে ব্যক্তিগত প্যাডলক এবং বিপদ ট্যাগ লাগান।',
      gu: 'ઇલેક્ટ્રિકલ બ્રેકર પર તમારું પર્સનલ લોક અને ડેન્જર ટેગ લગાવો.',
      ml: 'ഇലക്ട്രിക്കൽ ബ്രേക്കറിൽ നിങ്ങളുടെ വ്യക്തിഗത പാഡ്‌ലോക്ക് ഘടിപ്പിക്കുക.',
      pa: 'ਇਲੈਕਟ੍ਰੀਕਲ ਬ੍ਰੇਕਰ ਤੇ ਨਿੱਜੀ ਤਾਲਾ ਅਤੇ ਡੇਂਜਰ ਟੈਗ ਜ਼ਰੂਰ ਲਗਾਓ।',
      or: 'ବିଦ୍ୟୁତ ବ୍ରେକରରେ ନିଜସ୍ୱ ତାଲା ଏବଂ ବିପଦ ଟ୍ୟାଗ୍ ଲଗାନ୍ତୁ।',
    },
    quiz: {
      id: 'quiz-tech-03',
      question: 'Who is authorized to remove your personal LOTO padlock?',
      options: [
        { text: 'Any coworker who needs to use the machine', isCorrect: false, explanation: 'Never allowed under OSHA/CEA rules.' },
        { text: 'Only the worker whose name is on the lock after testing', isCorrect: true, explanation: 'Correct! 1 Person, 1 Lock, 1 Key.' },
        { text: 'The security guard at the gate', isCorrect: false, explanation: 'Security does not have technical isolation authority.' },
      ],
    },
  },
  {
    id: 'short-mfg-04',
    courseId: 'course-mfg-02',
    courseTitle: 'CNC Mill & Stamping Press Lockout-Tagout (LOTO)',
    title: 'CNC Mill Emergency Stop & Swarf Extraction',
    description: 'Never reach into a spinning spindle enclosure to clear metal chips. Use safety brush and coolant air jet.',
    sector: 'MANUFACTURING',
    sectorLabel: 'Manufacturing',
    sectorIcon: '🏭',
    skillTier: 'HIGHLY_SKILLED',
    tierLabel: 'Tier 4: Master Lead',
    durationSeconds: 58,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
    likesCount: 970,
    machineId: 'MACH-CNC-01',
    machineName: 'Haas 5-Axis VMC Milling Center',
    instructor: {
      name: 'Anil Verma',
      role: 'Precision Machining Lead',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Reaching bare hands into enclosure while spindle is rotating',
      detail: 'High speed carbide burrs cause immediate entanglement, severe lacerations or amputation.',
      icon: '❌',
    },
    rightWay: {
      title: 'Hit E-Stop or wait for interlock door stop, use brass hook',
      detail: 'Always wear ANSI Z87.1 safety glasses and use non-magnetic chip hook to clear chips.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Never reach bare hands into a rotating CNC spindle chamber. Wait for complete spindle standstill and use a brass chip hook.',
      hi: 'सीएनसी स्पिंडल घूमते समय कभी भी अंदर हाथ न डालें। स्पिंडल रुकने की प्रतीक्षा करें और ब्रास हुक का उपयोग करें।',
      te: 'తిరుగుతున్న సిఎన్‌సి మెషీన్‌లోకి చేతులు పెట్టవద్దు. స్పిండిల్ ఆగిన తర్వాత మాత్రమే చిప్స్ తొలగించండి.',
      ta: 'சுழலும் சிஎன்சி இயந்திரத்தினுள் கைகளை நுழைக்காதீர்கள். முழுமையாக நின்ற பின் கொக்கியை பயன்படுத்தவும்.',
      kn: 'ತಿರುಗುವ ಸಿಎನ್‌ಸಿ ಯಂತ್ರದೊಳಗೆ ಕೈ ಹಾಕಬೇಡಿ. ಯಂತ್ರ ನಿಂತ ನಂತರವೇ ಬ್ರಷ್ ಬಳಸಿ.',
      mr: 'फिरत्या सीएनसी मशीनमध्ये हात घालू नका. मशीन थांबल्यानंतर चिप हुक वापरा.',
      bn: 'ঘূর্ণায়মান সিএনসি মেশিনের ভেতর হাত দেবেন না। মেশিন সম্পূর্ণ থামার পর হুক ব্যবহার করুন।',
      gu: 'ફરતી સીએનસી મશીન અંદર ક્યારેય હાથ ન નાખો. સ્પિન્ડલ રોકાયા પછી જ ચિપ્સ સાફ કરો.',
      ml: 'കറങ്ങുന്ന സിഎൻസി മെഷീനിലേക്ക് കൈ കടത്തരുത്. സ്പിൻഡിൽ നിന്ന ശേഷം മാത്രം ചിപ്പ് ഹുക്ക് ഉപയോഗിക്കുക.',
      pa: 'ਘੁੰਮਦੀ ਸੀਐਨਸੀ ਮਸ਼ੀਨ ਵਿੱਚ ਕਦੇ ਵੀ ਹੱਥ ਨਾ ਪਾਓ। ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੁਕਣ ਉਪਰੰਤ ਹੁੱਕ ਵਰਤੋ।',
      or: 'ଘୂର୍ଣ୍ଣାୟମାନ ସିଏନସି ମେସିନ ଭିତରକୁ ହାତ ପୁରାନ୍ତୁ ନାହିଁ।',
    },
    quiz: {
      id: 'quiz-mfg-04',
      question: 'What is the required tool for clearing long curly metal swarf from a CNC table?',
      options: [
        { text: 'Bare hands with quick grabbing motion', isCorrect: false, explanation: 'Sharp swarf slices skin instantly.' },
        { text: 'A dedicated brass or aluminum chip hook with handguard', isCorrect: true, explanation: 'Correct! Keeps hand 30cm away from cutting edges.' },
        { text: 'Cotton rag held in hand', isCorrect: false, explanation: 'Rags entangle in rotating parts and pull hands in.' },
      ],
    },
  },
  {
    id: 'short-agri-05',
    courseId: 'course-agri-05',
    courseTitle: 'Harvester Tractor & PTO Machinery Operational Safety',
    title: 'Tractor PTO Shaft Guard Inspection',
    description: 'Ensure power take-off (PTO) master shield and spinner bell guards rotate freely and lock securely before operating.',
    sector: 'AGRICULTURE',
    sectorLabel: 'Agriculture',
    sectorIcon: '🌾',
    skillTier: 'SEMI_SKILLED',
    tierLabel: 'Tier 2: Semi-Skilled',
    durationSeconds: 48,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
    likesCount: 1420,
    machineId: 'TRAC-MAH-55',
    machineName: 'Mahindra 55HP 4WD Harvester Tractor',
    instructor: {
      name: 'Balwant Singh',
      role: 'Farm Machinery Training Officer',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Operating with missing or cracked yellow PTO bell guard',
      detail: 'Rotating shaft at 540 RPM can wrap clothing and limbs within 0.1 seconds.',
      icon: '❌',
    },
    rightWay: {
      title: 'Check retaining chain and spin guard housing independently',
      detail: 'Wear tight-fitting clothes, tuck shirts in, and never step over a live spinning drive shaft.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Inspect the tractor PTO shield before turning on equipment. Never step over a spinning shaft with loose clothes.',
      hi: 'ट्रैक्टर पीटीओ शाफ्ट के शील्ड की हमेशा जांच करें। ढीले कपड़ों के साथ घूमती शाफ्ट के ऊपर से कभी न कूदें।',
      te: 'ట్రాక్టర్ పిటిఓ షాఫ్ట్ గార్డును ఎల్లప్పుడూ తనిఖీ చేయండి. వదులుగా ఉన్న బట్టలతో దగ్గరకు వెళ్లవద్దు.',
      ta: 'டிராக்டர் பிடிஓ சுழல் தண்டின் பாதுகாப்புக் கவசத்தை பரிசோதிக்கவும்.',
      kn: 'ಟ್ರಾಕ್ಟರ್ ಪಿಟಿಒ ಗಾರ್ಡ್ ಸರಿಯಾಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಿ.',
      mr: 'ट्रॅक्टर पीटीओ शाफ्टचे कव्हर तपासा. सैल कपडे घालून जवळ जाऊ नका.',
      bn: 'ট্রাক্টরের পিটিও গার্ড পরীক্ষা করুন। ঢিলেঢালা পোশাক পরে কাছে যাবেন না।',
      gu: 'ટ્રેક્ટર પીટીઓ શિલ્ડનું નિરીક્ષણ કરો. ઢીલા કપડાં પહેરીને નજીક ન જવું.',
      ml: 'ട്രാക്ടർ പി‌ടി‌ഒ ഷാഫ്റ്റ് ഗാർഡ് പരിശോധിച്ച് ഉറപ്പുവരുത്തുക.',
      pa: 'ਟਰੈਕਟਰ ਪੀਟੀਓ ਸ਼ਾਫਟ ਦੇ ਕਵਰ ਦੀ ਜਾਂਚ ਕਰੋ। ਢਿੱਲੇ ਕੱਪੜੇ ਪਾ ਕੇ ਨੇੜੇ ਨਾ ਜਾਓ।',
      or: 'ଟ୍ରାକ୍ଟର ପିଟିଓ ଶାଫ୍ଟ ଗାର୍ଡ ଯାଞ୍ଚ କରନ୍ତୁ।',
    },
    quiz: {
      id: 'quiz-agri-05',
      question: 'At 540 RPM, how long does it take for an unguarded PTO shaft to wrap loose clothing?',
      options: [
        { text: 'Less than one second (approx 0.1 seconds)', isCorrect: true, explanation: 'Correct! Reaction time is slower than the shaft rotation.' },
        { text: 'About 30 seconds', isCorrect: false, explanation: 'Too slow; entrapment happens instantly.' },
        { text: 'Only if the tractor is moving forward', isCorrect: false, explanation: 'PTO rotates even when tractor is stationary.' },
      ],
    },
  },
  {
    id: 'short-clean-06',
    courseId: 'course-clean-06',
    courseTitle: 'Industrial Chemical Handling & Bio-Hazard Sanitation',
    title: 'Chemical Dilution & Acid Neutralizer Safety',
    description: 'Always pour chemical concentrate into water, NEVER water into concentrated acid. Wear nitrile gloves and splash goggles.',
    sector: 'CLEANING_MAINTENANCE',
    sectorLabel: 'Cleaning & Maintenance',
    sectorIcon: '🧹',
    skillTier: 'UNSKILLED',
    tierLabel: 'Tier 1: Unskilled',
    durationSeconds: 40,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&auto=format&fit=crop&q=80',
    likesCount: 1650,
    machineId: 'DISP-CHEM-12',
    machineName: 'Automated Janitorial Chemical Dilution Station',
    instructor: {
      name: 'Sunita Devi',
      role: 'Sanitation & Facility Lead',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Pouring cold water into concentrated descaler bottle',
      detail: 'Creates exothermic violent boiling splash that burns eyes and skin instantly.',
      icon: '❌',
    },
    rightWay: {
      title: 'Add Acid to Water slowly (A & W rule) wearing face shield',
      detail: 'Ensure ventilation exhaust fan is on and eye-wash station path is clear of obstacles.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Always add chemical concentrate slowly to water, never water to acid. Wear goggles and chemical-resistant gloves.',
      hi: 'हमेशा पानी में रसायन मिलाएं, कभी भी एसिड में पानी न डालें। चश्मा और दस्ताने अनिवार्य रूप से पहनें।',
      te: 'ఎల్లప్పుడూ నీటిలో రసాయనాన్ని నెమ్మదిగా కలపండి. యాసిడ్‌లో నీరు పోయవద్దు.',
      ta: 'எப்போதும் தண்ணீரில் ரசாயனத்தை கலக்கவும், அமிலத்தில் தண்ணீரை ஊற்ற வேண்டாம்.',
      kn: 'ಯಾವಾಗಲೂ ನೀರಿಗೆ ಕೆಮಿಕಲ್ ಸೇರಿಸಿ, ಆಸಿಡ್‌ಗೆ ನೀರು ಹಾಕಬೇಡಿ.',
      mr: 'नेहमी पाण्यात केमिकल टाका, अॅसिडमध्ये पाणी टाकू नका. गॉगल आणि हातमोजे वापरा.',
      bn: 'সর্বদা জলে রাসায়নিক মেশাবেন, এসিডে জল ঢালবেন না। গগলস পরুন।',
      gu: 'હંમેશા પાણીમાં કેમિકલ ઉમેરો, એસિડમાં પાણી ક્યારેય ન નાખો.',
      ml: 'എപ്പോഴും വെള്ളത്തിലേക്ക് രാസവസ്തു ചേർക്കുക, ആസിഡിലേക്ക് വെള്ളം ഒഴിക്കരുത്.',
      pa: 'ਹਮੇਸ਼ਾ ਪਾਣੀ ਵਿੱਚ ਕੈਮੀਕਲ ਮਿਲਾਓ, ਐਸਿਡ ਵਿੱਚ ਪਾਣੀ ਕਦੇ ਨਾ ਪਾਓ।',
      or: 'ସର୍ବଦା ପାଣିରେ କେମିକାଲ୍ ମିଶାନ୍ତୁ, ଏସିଡ଼ରେ ପାଣି ଢାଳନ୍ତୁ ନାହିଁ।',
    },
    quiz: {
      id: 'quiz-clean-06',
      question: 'What is the golden rule for mixing industrial cleaning acid and water?',
      options: [
        { text: 'Pour water rapidly into acid container', isCorrect: false, explanation: 'Violent splash reaction burns skin.' },
        { text: 'Add Acid to Water slowly (A&W rule)', isCorrect: true, explanation: 'Correct! Prevents exothermic splashing.' },
        { text: 'Mix both together in a closed bucket with tight lid', isCorrect: false, explanation: 'Builds explosive vapor pressure.' },
      ],
    },
  },
  {
    id: 'short-hosp-07',
    courseId: 'course-hosp-07',
    courseTitle: 'Commercial Kitchen Food Safety & Hot Oil Fire Protocol',
    title: 'Commercial Deep Fryer Oil Boil-Over Prevention',
    description: 'Never drop wet, icy food directly into 180°C hot oil. Drain ice crystals and use the wire basket lowering guide.',
    sector: 'HOSPITALITY_SERVICE',
    sectorLabel: 'Hospitality & Kitchen',
    sectorIcon: '🍳',
    skillTier: 'SKILLED',
    tierLabel: 'Tier 3: Skilled',
    durationSeconds: 46,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    likesCount: 1980,
    machineId: 'KIT-FRY-02',
    machineName: 'Pitco 20L Commercial Twin Tank Fryer',
    instructor: {
      name: 'Chef Anthony Murmu',
      role: 'Executive Safety Chef',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    },
    wrongWay: {
      title: 'Dumping frozen fries with visible ice chunks into fryer',
      detail: 'Water expands 1,700 times into steam instantly, causing a fiery boiling oil explosion.',
      icon: '❌',
    },
    rightWay: {
      title: 'Shake basket over drain trough, lower smoothly with tongs',
      detail: 'Keep oil level between Min and Max lines. Know location of Class K wet chemical fire extinguisher.',
      icon: '✔️',
    },
    audioNarrations: {
      en: 'Shake ice crystals off frozen food before placing into hot oil. Never use water on a kitchen grease fire.',
      hi: 'गर्म तेल में डालने से पहले खाद्य सामग्री से बर्फ के कण झाड़ लें। तेल की आग पर कभी पानी न डालें।',
      te: 'వేడి నూనెలో వేసే ముందు ఆహారం నుండి మంచును తొలగించండి. నూనె మంటలపై నీరు పోయవద్దు.',
      ta: 'சூடான எண்ணெயில் போடும் முன் பனிப்படலத்தை உதறி எடுக்கவும். எண்ணை தீயில் தண்ணீர் ஊற்றாதீர்கள்.',
      kn: 'ಬಿಸಿ ಎಣ್ಣೆಗೆ ಹಾಕುವ ಮುನ್ನ ಮಂಜುಗಡ್ಡೆ ಕಣಗಳನ್ನು ತೆಗೆಯಿರಿ.',
      mr: 'गरम तेलात टाकण्यापूर्वी अन्नावरील बर्फ झटकून घ्या. तेलाच्या आगीवर पाणी टाकू नका.',
      bn: 'গরম তেলে দেওয়ার আগে খাবারের বরফ ঝেড়ে ফেলুন। তেলে লাগা আগুনে জল দেবেন না।',
      gu: 'ગરમ તેલમાં નાખતા પહેલા બરફના કણો સાફ કરો. તેલની આગ પર ક્યારેય પાણી ન નાખો.',
      ml: 'ചൂടുള്ള എണ്ണയിലേക്ക് ഇടുന്നതിന് മുമ്പ് ഐസ് കണികകൾ കുടഞ്ഞു കളയുക.',
      pa: 'ਗਰਮ ਤੇਲ ਵਿੱਚ ਪਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਬਰਫ਼ ਝਾੜ ਲਓ। ਤੇਲ ਦੀ ਅੱਗ ਤੇ ਪਾਣੀ ਕਦੇ ਨਾ ਪਾਓ।',
      or: 'ଗରମ ତେଲରେ ପକାଇବା ପୂର୍ବରୁ ବରଫ ଝାଡ଼ି ଦିଅନ୍ତୁ।',
    },
    quiz: {
      id: 'quiz-hosp-07',
      question: 'What extinguisher type is mandatory for commercial kitchen cooking oil fires?',
      options: [
        { text: 'Water hose or water bucket', isCorrect: false, explanation: 'Explodes oil fire across the entire kitchen.' },
        { text: 'Class K Wet Chemical fire extinguisher', isCorrect: true, explanation: 'Correct! Saponifies hot grease and cuts off oxygen.' },
        { text: 'Compressed air blower', isCorrect: false, explanation: 'Fans the flames.' },
      ],
    },
  },
];
