import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { responseFormat } from './formats/response.format';
import { SYSTEM_CONTENT } from './constants';

@Injectable()
export class ChatService {
  private openai: OpenAI;
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  async sendCompletion(userText: string) {
    const completion = await this.openai.beta.chat.completions.parse({
      model: process.env.OPENAI_MODEL_NAME as string,
      messages: [
        {
          role: 'system',
          content: SYSTEM_CONTENT,
        },
        {
          role: 'user',
          content: userText,
        },
      ],
      store: true,
      response_format: zodResponseFormat(responseFormat, 'response_format'),
    });

    const response_format = completion.choices[0].message;

    if (completion.choices[0].finish_reason === 'length') {
      throw new Error('Incomplete response');
    }

    if (response_format.refusal) {
      throw new Error(response_format.refusal);
    }

    return response_format.parsed;
  }
}
