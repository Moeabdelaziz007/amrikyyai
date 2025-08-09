"""
LLM Service - Interface with language models (OpenAI, etc.)
"""

import openai
from typing import Optional, Dict, Any
import structlog
from datetime import datetime

from app.core.config import settings
from app.core.exceptions import LLMError, ExternalServiceError
from app.core.persona import get_persona_system_prompt, get_persona_context

logger = structlog.get_logger()

class LLMService:
    """Service for interacting with Large Language Models"""
    
    def __init__(self):
        self.client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.default_model = settings.OPENAI_MODEL
        self.default_temperature = settings.OPENAI_TEMPERATURE
        self.default_max_tokens = settings.OPENAI_MAX_TOKENS
    
    async def generate_response(
        self,
        prompt: str,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
        model: Optional[str] = None,
        system_prompt: Optional[str] = None
    ) -> str:
        """
        Generate response using LLM with persona-aware system prompt
        """
        try:
            # Use persona system prompt if not provided
            if not system_prompt:
                system_prompt = get_persona_system_prompt()
            
            # Prepare messages
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
            
            # Set parameters
            model = model or self.default_model
            temperature = temperature if temperature is not None else self.default_temperature
            max_tokens = max_tokens or self.default_max_tokens
            
            logger.info("Generating LLM response", 
                       model=model, 
                       temperature=temperature,
                       max_tokens=max_tokens,
                       prompt_length=len(prompt))
            
            start_time = datetime.utcnow()
            
            # Call OpenAI API
            response = await self.client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
                response_format={"type": "text"}
            )
            
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            
            # Extract response content
            content = response.choices[0].message.content
            tokens_used = response.usage.total_tokens if response.usage else None
            
            logger.info("LLM response generated successfully",
                       processing_time=processing_time,
                       tokens_used=tokens_used,
                       response_length=len(content) if content else 0)
            
            return content or "عذراً، لم أتمكن من توليد إجابة مناسبة."
            
        except openai.RateLimitError as e:
            logger.error("OpenAI rate limit exceeded", error=str(e))
            raise ExternalServiceError("تم تجاوز حد الاستخدام المسموح، يرجى المحاولة لاحقاً", "openai")
            
        except openai.AuthenticationError as e:
            logger.error("OpenAI authentication failed", error=str(e))
            raise ExternalServiceError("خطأ في المصادقة مع خدمة الذكاء الاصطناعي", "openai")
            
        except openai.APIError as e:
            logger.error("OpenAI API error", error=str(e))
            raise ExternalServiceError("خطأ في خدمة الذكاء الاصطناعي", "openai")
            
        except Exception as e:
            logger.error("Unexpected error in LLM service", error=str(e))
            raise LLMError(f"فشل في توليد الإجابة: {str(e)}")
    
    async def generate_personalized_response(
        self,
        query: str,
        retrieved_context: str = "",
        conversation_history: Optional[list] = None
    ) -> str:
        """
        Generate a personalized response as Amrikyy with retrieved context
        """
        try:
            # Build enhanced prompt with persona context
            persona_context = get_persona_context()
            
            # Construct full prompt
            if retrieved_context:
                full_prompt = f"""
{persona_context}

المصادر المسترجعة:
{retrieved_context}

السؤال: {query}

تعليمات: أجب على السؤال كـ محمد عبدالعزيز (Amrikyy) باستخدام المعلومات من المصادر المسترجعة. 
إذا كان السؤال عن معلوماتك الشخصية أو خبراتك، استخدم البيانات المتاحة. 
إذا لم تجد معلومات كافية في المصادر، أشر لذلك بوضوح.
اجعل إجابتك طبيعية ومفيدة مع الحفاظ على شخصيتك الودودة والمهنية.
"""
            else:
                full_prompt = f"""
{persona_context}

السؤال: {query}

تعليمات: أجب على السؤال كـ محمد عبدالعزيز (Amrikyy) بناءً على خلفيتك وخبراتك.
إذا كان السؤال يتطلب معلومات محددة ليست متوفرة، أشر لذلك واقترح كيف يمكن الحصول على المعلومة.
"""
            
            # Add conversation history if available
            if conversation_history:
                history_text = "\n".join([
                    f"{'أنت' if msg.get('role') == 'user' else 'أنا'}: {msg.get('content', '')}"
                    for msg in conversation_history[-3:]  # Last 3 messages
                ])
                full_prompt += f"\n\nسياق المحادثة السابقة:\n{history_text}\n"
            
            return await self.generate_response(
                prompt=full_prompt,
                temperature=0.2,  # Slightly higher for more personality
                max_tokens=self.default_max_tokens
            )
            
        except Exception as e:
            logger.error("Failed to generate personalized response", error=str(e))
            raise LLMError(f"فشل في توليد إجابة شخصية: {str(e)}")
    
    async def summarize_text(
        self,
        text: str,
        max_length: int = 200,
        language: str = "ar"
    ) -> str:
        """Summarize text content"""
        try:
            lang_instruction = "باللغة العربية" if language == "ar" else "in English"
            
            prompt = f"""
لخص النص التالي في {max_length} كلمة كحد أقصى {lang_instruction}.
ركز على النقاط الرئيسية والمعلومات المهمة.

النص:
{text}

الملخص:
"""
            
            response = await self.generate_response(
                prompt=prompt,
                temperature=0.1,
                max_tokens=max_length * 2  # Approximate token count
            )
            
            return response
            
        except Exception as e:
            logger.error("Failed to summarize text", error=str(e))
            raise LLMError(f"فشل في تلخيص النص: {str(e)}")
    
    async def extract_keywords(
        self,
        text: str,
        max_keywords: int = 10,
        language: str = "ar"
    ) -> list:
        """Extract keywords from text"""
        try:
            lang_instruction = "باللغة العربية" if language == "ar" else "in English"
            
            prompt = f"""
استخرج أهم {max_keywords} كلمات مفتاحية من النص التالي {lang_instruction}.
أرجع الكلمات المفتاحية كقائمة مفصولة بفواصل.

النص:
{text}

الكلمات المفتاحية:
"""
            
            response = await self.generate_response(
                prompt=prompt,
                temperature=0.1,
                max_tokens=200
            )
            
            # Parse keywords from response
            keywords = [kw.strip() for kw in response.split(',') if kw.strip()]
            return keywords[:max_keywords]
            
        except Exception as e:
            logger.error("Failed to extract keywords", error=str(e))
            return []
    
    async def generate_title(
        self,
        content: str,
        language: str = "ar"
    ) -> str:
        """Generate a title for content"""
        try:
            lang_instruction = "باللغة العربية" if language == "ar" else "in English"
            
            prompt = f"""
اقترح عنواناً مناسباً ومختصراً للنص التالي {lang_instruction}.
العنوان يجب أن يكون واضحاً ومعبراً عن المحتوى في 5-8 كلمات.

النص:
{content[:500]}...

العنوان المقترح:
"""
            
            response = await self.generate_response(
                prompt=prompt,
                temperature=0.3,
                max_tokens=50
            )
            
            return response.strip()
            
        except Exception as e:
            logger.error("Failed to generate title", error=str(e))
            return "بدون عنوان" if language == "ar" else "Untitled"
