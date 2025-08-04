import { NextRequest, NextResponse } from 'next/server'

// 실제 OpenAI API 연동을 위한 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

console.log('API 라우트 로드됨, OPENAI_API_KEY:', OPENAI_API_KEY ? '설정됨' : '설정되지 않음')

// 의료 특화 시스템 프롬프트 - 자연스러운 대화형 진료
const SYSTEM_PROMPT = `당신은 친근하고 전문적인 의사입니다. 환자와 자연스럽게 대화하면서 증상을 파악하고 있습니다.

진료 스타일:
- 친근하고 이해하기 쉬운 언어 사용
- 환자의 답변에 따라 자연스럽게 다음 질문 생성
- 형식적인 리스트 대신 대화형으로 진행
- 환자의 감정과 걱정에 공감하는 태도
- 전문적이면서도 따뜻한 톤 유지

대화 진행 방식:
1. 환자의 증상을 구체적으로 파악하기 위한 질문
2. 환자의 답변에 따라 관련된 추가 정보 수집
3. 증상의 패턴과 원인을 파악하기 위한 질문
4. 필요시 위험 신호 확인
5. 적절한 조언과 권고사항 제시

자동 요약 판단 기준:
다음 정보들이 모두 수집되면 자동으로 요약을 제공하세요:
- 주요 증상 (어디가 아픈지)
- 발생 시기 (언제부터)
- 증상 특징 (어떤 상황에서 심해지는지)
- 통증 강도나 추가 증상
- 원인이나 유발 요인

주의사항:
- 구체적인 진단이나 약물 처방은 하지 않음
- 응급 상황 시 즉시 119 연락 권고
- 의료진 상담의 중요성 강조
- 환자의 답변에 따라 유동적으로 질문 방향 조정

답변 형식:
- 자연스러운 대화형 질문
- 환자의 답변에 대한 이해와 공감 표현
- 다음 단계로 이어지는 자연스러운 질문
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

// 대화 단계 추적을 위한 함수
function determineConversationStage(history: any[]): string {
  if (history.length === 0) return 'initial'
  
  // 충분한 정보가 수집되었는지 확인
  const hasEnoughInfo = checkIfEnoughInfoCollected(history)
  if (hasEnoughInfo) return 'summary'
  
  if (history.length <= 2) return 'symptom_collection'
  if (history.length <= 4) return 'detailed_analysis'
  return 'summary'
}

// 충분한 정보가 수집되었는지 확인하는 함수
function checkIfEnoughInfoCollected(history: any[]): boolean {
  if (history.length < 4) return false // 최소 4번의 대화 필요
  
  const userMessages = history.filter(msg => msg.type === 'user').map(msg => msg.content.toLowerCase())
  const allText = userMessages.join(' ')
  
  // 필요한 정보들 확인
  const hasMainSymptom = /(머리|배|기침|목|팔|다리|가슴|등|발목|무릎|어깨|허리|손|발)/.test(allText)
  const hasTiming = /(어제|오늘|일주일|한달|며칠|몇일|언제)/.test(allText)
  const hasSeverity = /(많이|심하게|조금|가벼운|강한|약한|지속|간헐)/.test(allText)
  const hasTrigger = /(운동|다치|부딪|넘어|걸|달리|걷|앉|서|누워|만지|누르)/.test(allText)
  const hasAdditionalInfo = /(붓|부어|빨갛|따뜻|차갑|저림|마비|어지러|메스꺼|열|오한)/.test(allText)
  
  // 최소 3개 이상의 정보가 있어야 충분하다고 판단
  const infoCount = [hasMainSymptom, hasTiming, hasSeverity, hasTrigger, hasAdditionalInfo]
    .filter(Boolean).length
  
  return infoCount >= 3
}

// 모의 응답 생성 함수
function generateMockResponse(message: string, stage: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (stage === 'initial') {
    if (lowerMessage.includes('머리')) {
      return '안녕하세요! 어떤 증상으로 오셨나요? 머리가 아프시다고 하셨는데, 좀 더 구체적으로 말씀해주실 수 있나요?'
    } else if (lowerMessage.includes('배')) {
      return '안녕하세요! 배가 아프시다고 하셨는데, 어느 부분이 아프신가요?'
    } else if (lowerMessage.includes('기침')) {
      return '안녕하세요! 기침이 나신다고 하셨는데, 언제부터 시작되었나요?'
    } else if (lowerMessage.includes('팔')) {
      return '안녕하세요! 팔에 문제가 있으시다고 하셨는데, 어떤 증상인가요?'
    } else if (lowerMessage.includes('발목')) {
      return '안녕하세요! 발목에 문제가 있으시다고 하셨는데, 어떤 증상인가요?'
    } else {
      return '안녕하세요! 어떤 증상으로 오셨나요? 좀 더 구체적으로 말씀해주시면 도움을 드릴 수 있습니다.'
    }
  } else if (stage === 'symptom_collection') {
    if (lowerMessage.includes('편두통')) {
      return '아, 편두통이시군요. 그럼 몇 가지 더 확인해보겠습니다. 혹시 다른 증상도 함께 있나요?'
    } else if (lowerMessage.includes('복통')) {
      return '복통이시군요. 어느 쪽이 더 아프신가요? 오른쪽, 왼쪽, 아니면 전체적으로 아프신가요?'
    } else if (lowerMessage.includes('다치') || lowerMessage.includes('운동')) {
      return '다치셨다고 하셨네요. 언제쯤 다치셨나요? 그리고 다친 부위에 붓거나 멍이 생겼나요?'
    } else {
      return '그렇군요. 좀 더 구체적으로 말씀해주시면 더 정확한 도움을 드릴 수 있습니다.'
    }
  } else if (stage === 'detailed_analysis') {
    if (lowerMessage.includes('어제')) {
      return '어제부터 시작되었다고 하셨네요. 그럼 증상이 계속 지속되고 있나요?'
    } else if (lowerMessage.includes('오늘')) {
      return '오늘 시작되었다고 하셨네요. 혹시 특별한 이유가 있나요?'
    } else if (lowerMessage.includes('붓') || lowerMessage.includes('부어')) {
      return '붓기가 있다고 하셨네요. 통증은 어떤가요? 그리고 특정 움직임을 할 때 더 아프신가요?'
    } else {
      return '그렇군요. 다른 증상은 없으신가요?'
    }
  } else if (stage === 'summary') {
    // 자동 요약 제공
    if (lowerMessage.includes('발목')) {
      return `📋 **현재 상황 요약**
- 주요 증상: 발목 통증
- 발생 시기: 최근
- 증상 특징: 운동 후 발생, 붓기 동반

🔍 **가능한 원인**
- 인대 염좌
- 근육 긴장

⚠️ **주의사항**
- 심한 통증이나 부종 시 즉시 병원 방문

💡 **권고사항**
- 휴식과 냉찜질
- 정확한 진단을 위해 병원 방문 권고

정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.`
    } else if (lowerMessage.includes('머리')) {
      return `📋 **현재 상황 요약**
- 주요 증상: 두통
- 발생 시기: 최근
- 증상 특징: 지속적인 통증

🔍 **가능한 원인**
- 스트레스나 피로
- 긴장성 두통

⚠️ **주의사항**
- 심한 두통이나 다른 증상 동반 시 즉시 병원 방문

💡 **권고사항**
- 충분한 휴식과 스트레스 관리
- 정확한 진단을 위해 병원 방문 권고

정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.`
    } else {
      return `📋 **현재 상황 요약**
- 주요 증상: 통증
- 발생 시기: 최근
- 증상 특징: 지속적

🔍 **가능한 원인**
- 다양한 원인 가능성

⚠️ **주의사항**
- 심한 증상 시 즉시 병원 방문

💡 **권고사항**
- 정확한 진단을 위해 병원 방문 권고

정확한 진단과 치료를 위해서는 반드시 의료진과 상담하시기 바랍니다.`
    }
  }
  
  return '죄송합니다. 다시 한 번 말씀해주세요.'
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

    // 대화 단계 확인
    const conversationStage = determineConversationStage(conversationHistory)
    console.log('대화 단계:', conversationStage)

    // 대화 단계에 따른 추가 컨텍스트
    let stageContext = ''
    if (conversationStage === 'initial') {
      stageContext = '\n\n현재 첫 번째 상담입니다. 환자의 증상을 자연스럽게 파악하고 구체적인 질문을 하세요.'
    } else if (conversationStage === 'symptom_collection') {
      stageContext = '\n\n증상 수집 단계입니다. 환자의 답변에 따라 자연스럽게 관련된 추가 정보를 질문하세요.'
    } else if (conversationStage === 'detailed_analysis') {
      stageContext = '\n\n상세 분석 단계입니다. 수집된 정보를 바탕으로 가능한 원인과 위험도를 평가하세요.'
    } else {
      stageContext = '\n\n최종 요약 단계입니다. 수집된 모든 정보를 종합하여 현재 상태, 가능한 원인, 권고사항을 정리하세요.'
    }

    // OpenAI API 호출
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT + stageContext },
      ...conversationHistory.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    console.log('OpenAI API 호출 시작:', { message, conversationStage, messagesCount: messages.length })

    // 더 저렴한 모델 사용 (할당량 문제 해결)
    const modelToUse = 'gpt-3.5-turbo-16k' // 더 많은 토큰을 지원하는 모델

    // 대화 단계에 따른 토큰 수 조절
    let maxTokens = 400
    if (conversationStage === 'summary') {
      maxTokens = 600 // 요약 단계에서는 더 긴 응답 허용
    } else if (conversationStage === 'initial') {
      maxTokens = 300 // 초기 단계에서는 짧은 응답
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
              model: 'gpt-3.5-turbo', // 가장 기본적인 모델
              messages,
              max_tokens: 400, // 더 적은 토큰 사용
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
              stage: conversationStage,
              isRetry: true
            })
          }
        } catch (retryError) {
          console.log('재시도 실패, 모의 응답 사용')
        }
        
        // 모든 시도 실패 시 모의 응답 사용
        const mockResponse = generateMockResponse(message, conversationStage)
        return NextResponse.json({
          response: mockResponse,
          isEmergency: false,
          stage: conversationStage,
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
      stage: conversationStage
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