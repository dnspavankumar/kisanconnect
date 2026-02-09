// Mock API layer for development
// Replace with real API calls in production

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// OTP APIs
export const sendOTP = async (phone) => {
  await delay(1000);
  // In production, this would send actual OTP
  return {
    success: true,
    message: 'OTP sent successfully',
    otp: '1234', // Mock OTP for testing
  };
};

export const verifyOTP = async (phone, otp) => {
  await delay(800);
  if (otp === '1234') {
    return {
      success: true,
      message: 'OTP verified successfully',
      token: `mock_token_${Date.now()}`,
    };
  }
  return {
    success: false,
    message: 'Invalid OTP',
  };
};

// Helper to detect language
const detectLanguage = (text) => {
  const hindiRegex = /[\u0900-\u097F]/;
  const teluguRegex = /[\u0C00-\u0C7F]/;
  if (hindiRegex.test(text)) return 'hi';
  if (teluguRegex.test(text)) return 'te';
  return 'en';
};

// Real AI Chat Service
export const sendChatMessage = async (message, uiLanguage) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8081';
  const userLanguage = detectLanguage(message);

  console.log(`[AI Service] 📡 Requesting: ${backendUrl}/chat (UI: ${uiLanguage}, User: ${userLanguage})`);

  try {
    const response = await fetch(`${backendUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        language: uiLanguage, // Legacy fallback
        uiLanguage,
        userLanguage
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // If backend sends an error (like API Key issue), we show it
      throw new Error(data.content || data.error || 'Server connection failed');
    }

    // Return the real response from the backend
    return {
      message: data.content,
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error('[AI Service] ❌ Error:', error);
    throw error; // Let the UI handle the error display
  }
};

// Disease Detection API
export const detectDisease = async (imageFile) => {
  await delay(3000);

  // Mock disease detection result
  return {
    id: 'disease_1',
    name: {
      en: 'Cotton Leaf Curl Virus (CLCuV)',
      hi: 'कपास पत्ती मोड़ वायरस (CLCuV)',
      te: 'పత్తి ఆకు ముడత వైరస్ (CLCuV)',
    },
    severity: 'moderate',
    confidence: 87,
    description: {
      en: 'Cotton Leaf Curl Virus is a major disease affecting cotton plants. It causes upward curling of leaves and stunted growth.',
      hi: 'कपास पत्ती मोड़ वायरस कपास के पौधों को प्रभावित करने वाला एक प्रमुख रोग है। यह पत्तियों के ऊपर की ओर मुड़ने और विकास रुकने का कारण बनता है।',
      te: 'పత్తి ఆకు ముడత వైరస్ పత్తి మొక్కలను ప్రభావితం చేసే ప్రధాన వ్యాధి. ఇది ఆకులు పైకి ముడుచుకోవడానికి మరియు ఎదుగుదల ఆగిపోవడానికి కారణమవుతుంది.',
    },
    cureSteps: {
      en: [
        'Remove and destroy infected plants immediately',
        'Control whitefly population using neem oil spray',
        'Apply systemic insecticides like Imidacloprid',
        'Maintain proper spacing between plants',
        'Use resistant cotton varieties for next season',
      ],
      hi: [
        'संक्रमित पौधों को तुरंत हटाकर नष्ट करें',
        'नीम तेल स्प्रे का उपयोग करके सफेद मक्खी को नियंत्रित करें',
        'इमिडाक्लोप्रिड जैसे प्रणालीगत कीटनाशक लगाएं',
        'पौधों के बीच उचित दूरी बनाए रखें',
        'अगले सीजन के लिए प्रतिरोधी कपास किस्मों का उपयोग करें',
      ],
      te: [
        'సోకిన మొక్కలను వెంటనే తొలగించి నాశనం చేయండి',
        'వేప నూనె స్ప్రే ఉపయోగించి తెల్ల ఈగలను నియంత్రించండి',
        'ఇమిడాక్లోప్రిడ్ వంటి సిస్టమిక్ పురుగుమందులను వాడండి',
        'మొక్కల మధ్య సరైన దూరం ఉంచండి',
        'తదుపరి సీజన్ కోసం నిరోధక పత్తి రకాలను ఉపయోగించండి',
      ],
    },
    prevention: {
      en: [
        'Use certified disease-free seeds',
        'Plant resistant varieties like Bt cotton',
        'Regular monitoring for whitefly infestation',
        'Avoid late sowing of cotton',
        'Maintain field hygiene',
      ],
      hi: [
        'प्रमाणित रोग-मुक्त बीजों का उपयोग करें',
        'बीटी कॉटन जैसी प्रतिरोधी किस्में लगाएं',
        'सफेद मक्खी के संक्रमण की नियमित निगरानी करें',
        'कपास की देर से बुवाई से बचें',
        'खेत की स्वच्छता बनाए रखें',
      ],
      te: [
        'ధృవీకరించబడిన వ్యాధి-రహిత విత్తనాలను ఉపయోగించండి',
        'బీటీ కాటన్ వంటి నిరోధక రకాలను నాటండి',
        'తెల్ల ఈగల దాడి కోసం క్రమం తప్పకుండా పర్యవేక్షించండి',
        'పత్తిని ఆలస్యంగా విత్తకుండా ఉండండి',
        'పొలం పరిశుభ్రత పాటించండి',
      ],
    },
    medicines: [
      {
        name: 'Imidacloprid 17.8% SL',
        amazonLink: 'https://www.amazon.in/s?k=imidacloprid+insecticide',
        flipkartLink: 'https://www.flipkart.com/search?q=imidacloprid+insecticide',
        price: '₹450',
      },
      {
        name: 'Thiamethoxam 25% WG',
        amazonLink: 'https://www.amazon.in/s?k=thiamethoxam+insecticide',
        flipkartLink: 'https://www.flipkart.com/search?q=thiamethoxam+insecticide',
        price: '₹580',
      },
      {
        name: 'Neem Oil (Organic)',
        amazonLink: 'https://www.amazon.in/s?k=neem+oil+for+plants',
        flipkartLink: 'https://www.flipkart.com/search?q=neem+oil+for+plants',
        price: '₹320',
      },
    ],
  };
};

// Weather API
export const getWeather = async () => {
  await delay(500);
  return {
    temperature: 32,
    condition: 'partlyCloudy',
    humidity: 65,
    wind: 12,
    feelsLike: 35,
    location: 'Warangal, Telangana',
  };
};

// News API
export const getNews = async () => {
  await delay(800);
  return [
    {
      id: 'news_1',
      title: {
        en: 'PM-KISAN: ₹2000 Installment Released',
        hi: 'पीएम-किसान: ₹2000 की किस्त जारी',
        te: 'PM-KISAN: ₹2000 వాయిదా విడుదల',
      },
      summary: {
        en: 'The 16th installment of PM-KISAN scheme has been released. Check your bank account for the credited amount.',
        hi: 'पीएम-किसान योजना की 16वीं किस्त जारी कर दी गई है। क्रेडिट की गई राशि के लिए अपना बैंक खाता जांचें।',
        te: 'PM-KISAN పథకం 16వ వాయిదా విడుదల చేయబడింది. జమ అయిన మొత్తం కోసం మీ బ్యాంక్ ఖాతా తనిఖీ చేయండి.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      date: '2024-01-02',
      category: 'scheme',
    },
    {
      id: 'news_2',
      title: {
        en: 'Cotton Prices Rise 15% in Telangana Markets',
        hi: 'तेलंगाना बाजारों में कपास की कीमतें 15% बढ़ीं',
        te: 'తెలంగాణ మార్కెట్లలో పత్తి ధరలు 15% పెరిగాయి',
      },
      summary: {
        en: 'Cotton prices have increased significantly due to high demand from textile industries. MSP is now ₹7,020 per quintal.',
        hi: 'कपड़ा उद्योगों की उच्च मांग के कारण कपास की कीमतों में उल्लेखनीय वृद्धि हुई है। MSP अब ₹7,020 प्रति क्विंटल है।',
        te: 'వస్త్ర పరిశ్రమల నుండి అధిక డిమాండ్ కారణంగా పత్తి ధరలు గణనీయంగా పెరిగాయి. MSP ఇప్పుడు క్వింటాల్‌కు ₹7,020.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1599033329459-cc8c31c7eb9c?w=400',
      date: '2024-01-01',
      category: 'price',
    },
    {
      id: 'news_3',
      title: {
        en: 'New Subsidy for Drip Irrigation Announced',
        hi: 'ड्रिप सिंचाई के लिए नई सब्सिडी की घोषणा',
        te: 'డ్రిప్ ఇరిగేషన్ కోసం కొత్త సబ్సిడీ ప్రకటన',
      },
      summary: {
        en: 'Government announces 90% subsidy on drip irrigation systems for small and marginal farmers. Apply through your nearest agriculture office.',
        hi: 'सरकार ने छोटे और सीमांत किसानों के लिए ड्रिप सिंचाई प्रणालियों पर 90% सब्सिडी की घोषणा की। अपने निकटतम कृषि कार्यालय के माध्यम से आवेदन करें।',
        te: 'చిన్న మరియు సన్నకారు రైతులకు డ్రిప్ ఇరిగేషన్ సిస్టమ్స్‌పై 90% సబ్సిడీని ప్రభుత్వం ప్రకటించింది. మీ సమీపంలోని వ్యవసాయ కార్యాలయం ద్వారా దరఖాస్తు చేయండి.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400',
      date: '2023-12-28',
      category: 'scheme',
    },
    {
      id: 'news_4',
      title: {
        en: 'Expert Tips: Preparing for Rabi Season',
        hi: 'विशेषज्ञ सुझाव: रबी सीजन की तैयारी',
        te: 'నిపుణుల చిట్కాలు: రబీ సీజన్ కోసం సన్నద్ధత',
      },
      summary: {
        en: 'Agricultural experts share essential tips for preparing your cotton field for the upcoming Rabi season. Soil testing recommended.',
        hi: 'कृषि विशेषज्ञ आगामी रबी सीजन के लिए अपने कपास के खेत को तैयार करने के लिए आवश्यक सुझाव साझा करते हैं। मिट्टी परीक्षण अनुशंसित है।',
        te: 'రాబోయే రబీ సీజన్ కోసం మీ పత్తి పొలాన్ని సిద్ధం చేసేందుకు వ్యవసాయ నిపుణులు అవసరమైన చిట్కాలను పంచుకుంటారు. మట్టి పరీక్ష సిఫార్సు చేయబడింది.',
      },
      imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
      date: '2023-12-25',
      category: 'news',
    },
  ];
};
