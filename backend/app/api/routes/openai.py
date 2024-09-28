from fastapi import APIRouter
from openai import OpenAI
from decouple import config

router = APIRouter()

@router.post(
    "/test",
    status_code=201,
)
async def test_api_prompt(prompt:str):
   
   client = OpenAI(
        api_key=config('OPENAI_API_KEY')
    )

    # Creating a message as required by the API
   messages = [{"role": "user", "content": prompt}]
  
   # Calling the ChatCompletion API
   response = client.chat.completions.create(
       model="gpt-3.5-turbo",
       messages=messages,
       temperature=0,
   )

   return response
