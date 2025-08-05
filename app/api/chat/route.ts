import { NextRequest, NextResponse } from 'next/server'

// 실제 OpenAI API 연동을 위한 설정
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

console.log('API 라우트 로드됨, OPENAI_API_KEY:', OPENAI_API_KEY ? '설정됨' : '설정되지 않음')

// 의료 특화 시스템 프롬프트 - 자연스러운 의사 역할
const SYSTEM_PROMPT = `당신은 친근하고 전문적인 의사입니다. 환자와 자연스럽게 대화하면서 증상을 체계적으로 파악하고 있습니다.

🎯 역할과 태도:
- 친근하고 이해하기 쉬운 언어 사용
- 환자의 감정과 걱정에 공감하는 태도
- 전문적이면서도 따뜻한 톤 유지
- 환자의 답변을 충분히 듣고 다음 질문하기

📋 대화 진행 방식:
1. 환자의 증상을 하나씩 차근차근 파악
2. 각 질문에 대한 답변을 기다린 후 다음 질문 진행
3. 증상의 패턴과 원인을 순차적으로 파악
4. 필요시 위험 신호 확인
5. 적절한 조언과 권고사항 제시

🔍 정보 수집 우선순위:
1. 주요 증상 (어디가 아픈지)
2. 발생 시기 (언제부터)
3. 증상 특징 (어떤 상황에서 심해지는지)
4. 통증 강도나 추가 증상
5. 원인이나 유발 요인

✅ 자연스러운 대화 예시:
환자: "두통이 있어"
의사: "두통이 언제부터 시작되셨나요?"
환자: "어제부터"
의사: "어제부터 두통이 지속되고 있군요. 두통이 특히 어떤 상황에서 심해지나요?"

📝 대화 히스토리 활용:
- 이전 대화 내용을 참고하여 중복 질문 방지
- 이미 수집한 정보를 바탕으로 다음 질문 결정
- 환자가 언급한 증상들을 종합적으로 고려
- 대화의 맥락을 유지하면서 자연스럽게 진행

❌ 피해야 할 것들:
- 여러 질문을 동시에 하지 않기
- 이미 답변받은 내용을 다시 질문하지 않기
- 너무 복잡하거나 전문적인 용어 사용하지 않기
- 구체적인 진단이나 약물 처방하지 않기

⚠️ 주의사항:
- 응급 상황 시 즉시 119 연락 권고
- 의료진 상담의 중요성 강조
- 환자의 안전을 최우선으로 고려

답변 형식:
- 간단하고 명확한 하나의 질문만
- 환자의 답변에 대한 이해와 공감 표현
- 자연스러운 대화 흐름 유지
- 이전 대화 내용을 참고하여 적절한 질문 생성

충분한 정보 수집 후 요약:
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

// 간단한 대화 단계 결정
function determineConversationStage(history: any[]): string {
  if (history.length === 0) return 'initial'
  
  const userMessages = history.filter(msg => msg.type === 'user')
  const messageCount = userMessages.length
  
  if (messageCount >= 6) return 'summary'
  if (messageCount >= 5) return 'detailed_analysis'
  if (messageCount >= 2) return 'symptom_collection'
  return 'initial'
}

// 모의 응답 생성 함수 (OpenAI API 실패 시 사용)
function generateMockResponse(message: string, stage: string): string {
  const lowerMessage = message.toLowerCase()
  
  if (stage === 'summary') {
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
  
  if (lowerMessage.includes('머리') || lowerMessage.includes('두통')) {
    return '두통이 언제부터 시작되셨나요?'
  }
  if (lowerMessage.includes('배') || lowerMessage.includes('복통')) {
    return '복통이 어느 쪽이 더 아프신가요?'
  }
  if (lowerMessage.includes('기침')) {
    return '기침이 언제부터 시작되었나요?'
  }
  if (lowerMessage.includes('목')) {
    return '목이 언제부터 아프신가요?'
  }
  
  return '어떤 증상으로 오셨나요? 좀 더 구체적으로 말씀해주세요.'
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

    // 대화 단계 결정
    const conversationStage = determineConversationStage(conversationHistory)
    console.log('대화 단계:', conversationStage)

    // 대화 히스토리 정리 (최근 30개 메시지로 증가)
    const cleanedHistory = conversationHistory
      .filter((msg: any) => msg.content && msg.content.trim() !== '')
      .slice(-30) // 20개에서 30개로 증가

    // OpenAI API 호출
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...cleanedHistory.map((msg: any) => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    console.log('OpenAI API 호출 시작:', { message, conversationStage, messagesCount: messages.length })

    // 토큰 설정 - 더 많은 컨텍스트를 위해 증가
    const modelToUse = 'gpt-3.5-turbo-16k'
    let maxTokens = 1000 // 800에서 1000으로 증가
    if (conversationStage === 'summary') {
      maxTokens = 1500 // 1200에서 1500으로 증가
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
              max_tokens: 1000, // 800에서 1000으로 증가
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