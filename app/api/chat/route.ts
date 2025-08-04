import { NextRequest, NextResponse } from 'next/server'

// 실제 OpenAI API 연동을 위한 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

console.log('API 라우트 로드됨, OPENAI_API_KEY:', OPENAI_API_KEY ? '설정됨' : '설정되지 않음')

// 의료 특화 시스템 프롬프트 - 대화 히스토리 기반 지능적 응답
const SYSTEM_PROMPT = `당신은 친근하고 전문적인 의사입니다. 환자와 자연스럽게 대화하면서 증상을 체계적으로 파악하고 있습니다.

🎯 핵심 규칙:
1. 대화 히스토리를 꼼꼼히 분석하여 이미 답변받은 정보는 절대 다시 질문하지 마세요
2. 한 번에 하나의 질문만 하세요
3. 환자의 이전 답변을 바탕으로 다음 질문을 결정하세요
4. 중복되지 않는 새로운 정보만 요청하세요

📋 대화 분석 방법:
- 이전 대화에서 환자가 이미 말한 증상, 시기, 특징 등을 정확히 파악
- 아직 답변받지 못한 정보만 질문
- 환자의 답변 패턴을 분석하여 관련된 추가 정보 요청

🔍 정보 수집 우선순위:
1. 주요 증상 (어디가 아픈지) - 이미 답변받았다면 다음으로
2. 발생 시기 (언제부터) - 이미 답변받았다면 다음으로  
3. 증상 특징 (어떤 상황에서 심해지는지) - 이미 답변받았다면 다음으로
4. 통증 강도나 추가 증상 - 이미 답변받았다면 다음으로
5. 원인이나 유발 요인 - 이미 답변받았다면 다음으로

✅ 대화 히스토리 활용 예시:
환자: "두통이 있어"
AI: "두통이 언제부터 시작되셨나요?"
환자: "어제부터"
AI: "어제부터 두통이 지속되고 있군요. 두통이 특히 어떤 상황에서 심해지나요?" (시기는 이미 알았으므로 다음 정보 요청)

❌ 잘못된 예시:
환자: "두통이 있어"
AI: "두통이 언제부터 시작되셨나요?"
환자: "어제부터"
AI: "두통이 언제부터 시작되셨나요?" (중복 질문 - 절대 금지)

📊 대화 상태 추적:
- 현재까지 수집된 정보를 정리하여 다음 질문 결정
- 충분한 정보가 수집되면 자동으로 요약 제공
- 응급 상황 감지 시 즉시 대응

💡 지능적 응답 방식:
1. 이전 대화 분석 → 이미 답변받은 정보 파악
2. 누락된 정보 식별 → 새로운 질문 결정
3. 관련성 있는 추가 정보 요청
4. 충분한 정보 수집 시 요약 제공

⚠️ 주의사항:
- 절대 중복 질문하지 마세요
- 이미 답변받은 내용은 활용하되 다시 질문하지 마세요
- 구체적인 진단이나 약물 처방은 하지 마세요
- 응급 상황 시 즉시 119 연락 권고
- 의료진 상담의 중요성 강조

답변 형식:
- 간단하고 명확한 하나의 질문만
- 이전 대화 내용을 참고한 자연스러운 다음 질문
- 필요시 간단한 설명이나 안내

자동 요약 시 (충분한 정보 수집 후):
다음 형식으로 간결하게 요약해주세요:

📋 **현재 상황 요약**
- 주요 증상: [증상 요약]
- 발생 시기: [언제부터]
- 증상 특징: [어떤 상황에서 심해지는지]

🔍 **가능한 원인**
- [가능한 원인 1-2개]

⚠️ **주의사항**
- [즉시 병원 방문이 필요한 경우]
- [일반적인 주의사항]

💡 **권고사항**
- [즉시 조치사항]
- [병원 방문 권고]

항상 "정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다"로 마무리하세요.`

// 응급 상황 키워드
const EMERGENCY_KEYWORDS = [
  '심한 통증', '의식 상실', '호흡 곤란', '출혈',
  '가슴 통증', '마비', '발작', '중독', '응급', '119',
  '심장마비', '뇌졸중', '복통', '고열', '경련'
]

function isEmergency(message: string): boolean {
  return EMERGENCY_KEYWORDS.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  )
}

// 대화 히스토리 분석 함수
function analyzeConversationHistory(history: any[]): {
  collectedInfo: any,
  missingInfo: string[],
  stage: string
} {
  const userMessages = history.filter(msg => msg.type === 'user').map(msg => msg.content.toLowerCase())
  const allText = userMessages.join(' ')
  
  // 수집된 정보 분석
  const collectedInfo = {
    mainSymptom: extractMainSymptom(allText),
    timing: extractTiming(allText),
    severity: extractSeverity(allText),
    trigger: extractTrigger(allText),
    additionalSymptoms: extractAdditionalSymptoms(allText)
  }
  
  // 누락된 정보 식별
  const missingInfo = []
  if (!collectedInfo.mainSymptom) missingInfo.push('주요 증상')
  if (!collectedInfo.timing) missingInfo.push('발생 시기')
  if (!collectedInfo.severity) missingInfo.push('증상 강도')
  if (!collectedInfo.trigger) missingInfo.push('유발 요인')
  if (!collectedInfo.additionalSymptoms) missingInfo.push('추가 증상')
  
  // 대화 단계 결정
  let stage = 'initial'
  if (history.length >= 6 && missingInfo.length <= 1) {
    stage = 'summary'
  } else if (history.length >= 4) {
    stage = 'detailed_analysis'
  } else if (history.length >= 2) {
    stage = 'symptom_collection'
  }
  
  return { collectedInfo, missingInfo, stage }
}

// 정보 추출 함수들
function extractMainSymptom(text: string): string | null {
  const symptoms = ['머리', '두통', '배', '복통', '기침', '목', '팔', '다리', '가슴', '등', '발목', '무릎', '어깨', '허리', '손', '발']
  for (const symptom of symptoms) {
    if (text.includes(symptom)) return symptom
  }
  return null
}

function extractTiming(text: string): string | null {
  const timingPatterns = ['어제', '오늘', '일주일', '한달', '며칠', '몇일', '언제']
  for (const pattern of timingPatterns) {
    if (text.includes(pattern)) return pattern
  }
  return null
}

function extractSeverity(text: string): string | null {
  const severityPatterns = ['많이', '심하게', '조금', '가벼운', '강한', '약한', '지속', '간헐']
  for (const pattern of severityPatterns) {
    if (text.includes(pattern)) return pattern
  }
  return null
}

function extractTrigger(text: string): string | null {
  const triggerPatterns = ['운동', '다치', '부딪', '넘어', '걸', '달리', '걷', '앉', '서', '누워', '만지', '누르']
  for (const pattern of triggerPatterns) {
    if (text.includes(pattern)) return pattern
  }
  return null
}

function extractAdditionalSymptoms(text: string): string | null {
  const additionalPatterns = ['붓', '부어', '빨갛', '따뜻', '차갑', '저림', '마비', '어지러', '메스꺼', '열', '오한']
  for (const pattern of additionalPatterns) {
    if (text.includes(pattern)) return pattern
  }
  return null
}

// 모의 응답 생성 함수 (OpenAI API 실패 시 사용)
function generateMockResponse(message: string, analysis: any): string {
  const { collectedInfo, missingInfo, stage } = analysis
  const lowerMessage = message.toLowerCase()
  
  if (stage === 'summary') {
    return `📋 **현재 상황 요약**
- 주요 증상: ${collectedInfo.mainSymptom || '통증'}
- 발생 시기: ${collectedInfo.timing || '최근'}
- 증상 특징: ${collectedInfo.severity || '지속적'}

🔍 **가능한 원인**
- 다양한 원인 가능성

⚠️ **주의사항**
- 심한 증상 시 즉시 병원 방문

💡 **권고사항**
- 정확한 진단을 위해 병원 방문 권고

정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.`
  }
  
  // 누락된 정보에 따른 질문
  if (missingInfo.includes('주요 증상')) {
    return '어떤 증상으로 오셨나요? 좀 더 구체적으로 말씀해주세요.'
  }
  if (missingInfo.includes('발생 시기')) {
    return '언제부터 이런 증상이 있으셨나요?'
  }
  if (missingInfo.includes('증상 강도')) {
    return '증상이 얼마나 심한가요?'
  }
  if (missingInfo.includes('유발 요인')) {
    return '특별한 이유나 계기가 있으셨나요?'
  }
  if (missingInfo.includes('추가 증상')) {
    return '다른 증상도 함께 있으신가요?'
  }
  
  return '그렇군요. 다른 증상은 없으신가요?'
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST 요청 받음')
    
    const { message, conversationHistory = [] } = await request.json()
    console.log('요청 데이터:', { message, conversationHistoryLength: conversationHistory.length })

    if (!message) {
      console.log('메시지가 없음')
      return NextResponse.json(
        { error: '메시지가 필요합니다.' },
        { status: 400 }
      )
    }

    // 응급 상황 감지
    const isEmergencyCase = isEmergency(message)
    console.log('응급 상황 여부:', isEmergencyCase)
    
    if (isEmergencyCase) {
      console.log('응급 상황 감지됨')
      return NextResponse.json({
        response: `⚠️ 응급 상황이 감지되었습니다!

즉시 119에 연락하거나 가까운 응급실을 방문하세요.

이것은 AI 상담의 한계이며, 전문 의료진의 즉시 진료가 필요합니다.

정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.`,
        isEmergency: true
      })
    }

    // OpenAI API 키 확인
    console.log('OpenAI API 키 확인:', OPENAI_API_KEY ? '있음' : '없음')
    if (!OPENAI_API_KEY) {
      console.log('OpenAI API 키가 없음')
      return NextResponse.json({
        error: 'OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 OPENAI_API_KEY를 설정해주세요.'
      }, { status: 500 })
    }

    // 대화 히스토리 분석
    const analysis = analyzeConversationHistory(conversationHistory)
    console.log('대화 분석 결과:', analysis)

    // 대화 단계에 따른 추가 컨텍스트
    let stageContext = ''
    if (analysis.stage === 'initial') {
      stageContext = '\n\n현재 첫 번째 상담입니다. 환자의 증상을 자연스럽게 파악하고 구체적인 질문을 하세요. 반드시 한 번에 하나의 질문만 하세요.'
    } else if (analysis.stage === 'symptom_collection') {
      stageContext = `\n\n증상 수집 단계입니다. 현재까지 수집된 정보: ${JSON.stringify(analysis.collectedInfo)}. 누락된 정보: ${analysis.missingInfo.join(', ')}. 이전 대화에서 이미 답변받은 내용은 다시 질문하지 마세요. 반드시 한 번에 하나의 질문만 하세요.`
    } else if (analysis.stage === 'detailed_analysis') {
      stageContext = `\n\n상세 분석 단계입니다. 현재까지 수집된 정보: ${JSON.stringify(analysis.collectedInfo)}. 이전 대화 내용을 참고하여 중복되지 않는 새로운 정보만 요청하세요. 반드시 한 번에 하나의 질문만 하세요.`
    } else {
      stageContext = '\n\n최종 요약 단계입니다. 수집된 모든 정보를 종합하여 현재 상태, 가능한 원인, 권고사항을 정리하세요.'
    }

    // 대화 히스토리 정리
    const cleanedHistory = conversationHistory.filter((msg: any) => {
      return msg.content && msg.content.trim() !== ''
    })

    // OpenAI API 호출
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + stageContext },
      ...cleanedHistory.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    console.log('OpenAI API 호출 시작:', { message, stage: analysis.stage, messagesCount: messages.length })

    // 더 저렴한 모델 사용 (할당량 문제 해결)
    const modelToUse = 'gpt-3.5-turbo-16k'

    // 대화 단계에 따른 토큰 수 조절
    let maxTokens = 400
    if (analysis.stage === 'summary') {
      maxTokens = 600
    } else if (analysis.stage === 'initial') {
      maxTokens = 300
    }

    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages,
        max_tokens: maxTokens,
        temperature: 0.7
      })
    })

    console.log('OpenAI API 응답 상태:', response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API 오류:', errorData)
      
      // 할당량 초과 시 더 저렴한 모델로 재시도
      if (response.status === 429) {
        console.log('API 할당량 초과, 더 저렴한 모델로 재시도')
        
        try {
          const retryResponse = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages,
              max_tokens: 400,
              temperature: 0.7
            })
          })
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json()
            const aiResponse = retryData.choices[0].message.content
            console.log('재시도 성공, AI 응답 생성됨:', aiResponse.substring(0, 100) + '...')
            
            return NextResponse.json({
              response: aiResponse,
              isEmergency: false,
              stage: analysis.stage,
              isRetry: true
            })
          }
        } catch (retryError) {
          console.log('재시도 실패, 모의 응답 사용')
        }
        
        // 모든 시도 실패 시 모의 응답 사용
        const mockResponse = generateMockResponse(message, analysis)
        return NextResponse.json({
          response: mockResponse,
          isEmergency: false,
          stage: analysis.stage,
          isMock: true
        })
      }
      
      throw new Error(`OpenAI API 호출 실패: ${response.status} - ${errorData}`)
    }

    const data = await response.json()
    console.log('OpenAI API 응답 데이터 수신됨')
    
    const aiResponse = data.choices[0].message.content
    console.log('AI 응답 생성됨:', aiResponse.substring(0, 100) + '...')

    return NextResponse.json({
      response: aiResponse,
      isEmergency: false,
      stage: analysis.stage
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json(
      { error: `서버 오류가 발생했습니다: ${errorMessage}` },
      { status: 500 }
    )
  }
} 